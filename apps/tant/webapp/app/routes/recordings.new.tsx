import { Button, FileInput, Stack, Title } from "@mantine/core";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { namedAction } from "remix-utils/named-action";

import { withCache } from "../lib/cache.server";
import {
  createRecordingAndPrepareForUpload,
  updateRecordingAfterUpload,
} from "../services/recordings.server";

const delay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  return namedAction(formData, {
    async create() {
      const filename = formData.get("file");

      if (!filename) {
        await delay(1000);
        return json({
          status: "error",
          field: {
            file: "File is required",
          },
        });
      }

      if (typeof filename !== "string") {
        return json({
          status: "error",
          field: {
            file: "Invalid file",
          },
        });
      }

      const recording = await withCache(
        `new-recording-${filename}`,
        () => createRecordingAndPrepareForUpload({ filename }),
        {
          ttl: 1000 * 60 * 60,
        }
      );

      return json({
        status: "created",
        recording,
      });
    },

    async update() {
      const id = formData.get("id");

      if (!id || typeof id !== "string") {
        return json({
          status: "error",
          message: "Wrong id when updating recording",
        });
      }

      await updateRecordingAfterUpload(id);
      return redirect(`/recordings/${id}`);
    },
  });
}

export default function NewRecording() {
  const fetcher = useFetcher({ key: "new-recording" });
  const [errorFields, setErrorFields] = useState({
    file: null,
  });

  useEffect(() => {
    const uploadToS3 = async (presignedUrl: string, file: File) => {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });

      console.log("uploaded", response);

      return response;
    };

    if (!fetcher.data) return;

    if (fetcher.data.status === "error") {
      setErrorFields(fetcher.data.field);
      return;
    }

    if (fetcher.data.status === "created") {
      console.log("uploading....");
      uploadToS3(
        fetcher.data.recording.presigned_url,
        fetcher.formData?.get("file")
      ).then(() => {
        const formData = new FormData();
        formData.append("intent", "update");
        formData.append("id", fetcher.data.recording.id);

        fetcher.submit(formData, {
          method: "POST",
        });
      });

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  console.log({ errorFields });

  const fetcherIsLoading = fetcher.state === "submitting";
  const intent = fetcher.data?.status === "created" ? "update" : "create";
  const buttonLabel =
    intent === "create" && fetcherIsLoading
      ? "Submitting"
      : intent === "update" && fetcherIsLoading
      ? "Uploading"
      : "Submit";

  return (
    <Stack gap={20}>
      <Title order={1}>New Recording</Title>

      <fetcher.Form method="post">
        <Stack>
          <FileInput
            clearable
            label="Upload Recording"
            placeholder="Choose recording"
            accept="audio/*"
            required
            name="file"
            disabled={fetcherIsLoading}
            error={errorFields.file}
            onChange={() => {
              setErrorFields((f) => ({
                ...f,
                file: null,
              }));
            }}
          />
          <Button
            type="submit"
            name="intent"
            value={intent}
            loading={fetcherIsLoading}
            onClick={() => {
              setErrorFields({
                file: null,
              });
            }}
          >
            {buttonLabel}
          </Button>
        </Stack>
      </fetcher.Form>
    </Stack>
  );
}
