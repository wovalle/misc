import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { getRecordings } from "../lib/directus";
import { createRecordingAndPrepareForUpload } from "../services/recordings.server";
import { assertMethod, assertTantHeaders } from "./helpers";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  assertTantHeaders(request);

  const recordings = await getRecordings();

  return {
    data: recordings,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  assertTantHeaders(request);
  assertMethod(request, "POST");

  const body = await request.json();

  if (!body.filename) {
    throw new Response("Invalid body", { status: 400 });
  }

  const recording = createRecordingAndPrepareForUpload({
    filename: body.filename,
  });

  return json({ data: recording }, { status: 201 });
};
