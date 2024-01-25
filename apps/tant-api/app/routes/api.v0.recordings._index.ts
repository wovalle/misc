import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { createRecording, getRecordings } from "../lib/directus";
import { getPresignedUrl } from "../lib/s3";
import { assertMethod, assertTantHeaders } from "./helpers";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  assertTantHeaders(request);

  const recordings = await getRecordings();

  return {
    recordings,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  assertTantHeaders(request);
  assertMethod(request, "POST");

  const body = await request.json();

  if (!body.filename) {
    throw new Response("Invalid body", { status: 400 });
  }

  const datePrefix = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace("T", "-")
    .replace("Z", "")
    .replace(/\./g, "-");

  const fileKey = `${datePrefix}-${body.id}`;

  const url = await getPresignedUrl(fileKey);
  const recording = await createRecording(fileKey, url);

  return json(recording, { status: 201 });
};
