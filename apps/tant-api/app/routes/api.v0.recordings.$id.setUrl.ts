import { ActionFunctionArgs, json } from "@remix-run/node";
import { updateRecording } from "../lib/directus";
import { recordingSchema } from "../lib/entities";
import { assertMethod, assertTantHeaders } from "./helpers";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  assertTantHeaders(request);
  assertMethod(request, "PATCH");

  if (!params.id) {
    throw new Response("Invalid body", { status: 400 });
  }

  const rawBody = await request.json();
  const body = recordingSchema.partial().parse(rawBody);

  if (!body.url) {
    throw new Response("Invalid body", { status: 400 });
  }

  const recording = await updateRecording(params.id, {
    url: body.url,
    status: "uploaded",
  });

  return json(recording, { status: 200 });
};
