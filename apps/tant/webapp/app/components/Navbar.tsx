import {
  ActionIcon,
  Group,
  NavLink as MantineNavLink,
  Stack,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import { Link, useLoaderData } from "@remix-run/react";
import { IconPlus } from "@tabler/icons-react";
import { type loader } from "../root";

export const Navbar = () => {
  const { recordings } = useLoaderData<typeof loader>();

  const buttons = recordings.map((recording) => (
    <MantineNavLink
      key={recording.id}
      href={`/recordings/${recording.id}`}
      label={recording.id}
    />
  ));

  return (
    <Stack h={300} bg="var(--mantine-color-body)">
      <Group justify="space-between">
        <Text size="xs" fw={500} c="dimmed">
          Recordings
        </Text>

        <Tooltip label="Create recording" withArrow position="right">
          <Link to="/recordings/new">
            <ActionIcon variant="default" size={18}>
              <IconPlus
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Link>
        </Tooltip>
      </Group>

      {buttons}
    </Stack>
  );
};
