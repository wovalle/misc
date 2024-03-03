import { ActionFunctionArgs, json } from "@remix-run/node";
import { updateRecordingAfterUpload } from "../services/recordings.server";
import { assertMethod, assertTantHeaders } from "./helpers";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  assertTantHeaders(request);
  assertMethod(request, "PATCH");

  if (!params.id) {
    throw new Response("Invalid body", { status: 400 });
  }

  const updatedRecording = updateRecordingAfterUpload(params.id);

  return json({ data: updatedRecording }, { status: 200 });
};
