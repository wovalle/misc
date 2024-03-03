import {
  Badge,
  Button,
  Drawer,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Suspense, lazy, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { namedAction } from "remix-utils/named-action";
import invariant from "tiny-invariant";
import { withCache } from "../lib/cache.server";
import { getRecording } from "../lib/directus";
import { getPresignedUrl } from "../lib/s3";
import { createAssemblyAiTranscription } from "../services/transcriptions.server";
import { Transcription } from "../shared/entities";

const R = lazy(() =>
  // @ts-expect-error - don't know why is erroring but it works
  import("@microlink/react-json-view").then((m) => m.default)
);

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id;

  invariant(id, "No id provided");

  const recording = await withCache(["recording", id], () => getRecording(id), {
    ttl: 1000 * 60 * 60,
  });

  const presignedUrl = await withCache(
    ["presigned-url", recording.id],
    () =>
      getPresignedUrl(recording.id, {
        command: "read",
      }),
    { ttl: 1000 * 60 * 5 }
  );

  return { recording, presignedUrl };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  return namedAction(formData, {
    createTranscription: async () => {
      const id = formData.get("id");

      if (!id) {
        throw new Response("No id provided", { status: 400 });
      }

      if (typeof id !== "string") {
        throw new Response("Invalid id", { status: 400 });
      }

      console.log("creating transcription...");

      const transcription = await createAssemblyAiTranscription(id);

      return json({ transcription });
    },
  });
};

const Field = ({
  label,
  children,
  inline,
}: {
  label: string;
  children: React.ReactNode;
  inline?: boolean;
}) => {
  const C = inline ? Group : Stack;

  return (
    <C gap={2}>
      <Text size="l" fw={600} component="h2">
        {label}
      </Text>
      <Text size="sm" c="dimmed">
        {children}
      </Text>
    </C>
  );
};

const Audio = (opts: { url: string }) => {
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio controls>
      <source src={opts.url} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default function RecordingId() {
  const { recording, presignedUrl } = useLoaderData<typeof loader>();
  const [selectedTranscription, setSelectedTranscription] = useState<
    Transcription | undefined
  >();
  const [opened, { open, close }] = useDisclosure(false);
  const fetcher = useFetcher();

  const url =
    "https://zoidberg.willy.im/admin/content/recordings/" + recording.id;

  const rows = recording.transcriptions?.map((t) => (
    <Table.Tr key={t.id}>
      <Table.Td>{t.id}</Table.Td>
      <Table.Td>{t.provider}</Table.Td>
      <Table.Td>{new Date(t.date_created).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Button
          variant="subtle"
          onClick={() => {
            setSelectedTranscription(t);
            open();
          }}
        >
          Show
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap={20}>
      <Stack gap={2}>
        <Title order={1}>Recording details</Title>

        <Text size="sm" c="dimmed">
          Details for the recording with id: {recording.id}
        </Text>
      </Stack>

      <Group>
        <fetcher.Form method="POST">
          <Button
            type="submit"
            size="xs"
            name="intent"
            value="createTranscription"
            variant="light"
            loading={
              fetcher.state === "loading" || fetcher.state === "submitting"
            }
          >
            Create Transcription
          </Button>
          <input type="hidden" name="id" value={recording.id} />
        </fetcher.Form>
      </Group>

      <Field label="Status" inline>
        <Badge variant="filled" ml={8}>
          {recording.status}
        </Badge>
      </Field>

      <Field label="Created At">
        {new Date(recording.date_created).toLocaleString()}
      </Field>
      <Field label="URL">{url}</Field>
      <Field label="Presigned Url">{recording.presigned_url}</Field>
      <Field label="Audio">
        <Audio url={presignedUrl} />
      </Field>

      <Stack>
        <Title order={2}>Transcriptions</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Id</Table.Th>
              <Table.Th>Provider</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Body</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Stack>

      <Drawer
        opened={opened}
        onClose={close}
        title={selectedTranscription?.id}
        position="right"
        size={800}
      >
        <ClientOnly>
          {() => (
            <Suspense fallback={<div>Loading...</div>}>
              <R src={selectedTranscription?.body ?? {}} />
            </Suspense>
          )}
        </ClientOnly>
      </Drawer>
    </Stack>
  );
}
