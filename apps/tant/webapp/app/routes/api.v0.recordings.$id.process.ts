import { ActionFunctionArgs, json } from "@remix-run/node";
import { createDictation as createAssemblyAiDictation } from "../lib/assemblyai";
import { getRecording, updateRecording } from "../lib/directus";
import { transcodeM4aToMp3 } from "../lib/ffmpeg.server";
import { getFile } from "../lib/s3";
import { transcriptionRequestSchema } from "../shared/entities";
import { assertMethod, assertTantHeaders } from "./helpers";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  assertTantHeaders(request);
  assertMethod(request, "POST");

  if (!params.id) {
    throw new Response("Invalid body", { status: 400 });
  }

  const transcriptionRequest = transcriptionRequestSchema.parse(params);

  const recording = await getRecording(transcriptionRequest.id);

  if (!recording) {
    throw new Response("Recording not found", { status: 404 });
  }

  console.log("downloading file");
  // TODO: I should add a "transcoded" entity to the recording where I store the transcoded file
  let fileStream: ReadableStream<unknown> | undefined = await getFile(
    transcriptionRequest.id
  );
  console.log("file downloaded");

  if (!fileStream) {
    throw new Response("File not found", { status: 404 });
  }

  if (recording.id.endsWith(".m4a")) {
    console.log("transcoding file");
    fileStream = await transcodeM4aToMp3(recording.id, fileStream);
  }

  console.log("creating dictation...");
  const dictation = await createAssemblyAiDictation(fileStream);
  console.log("dictation created");

  console.log("got dictation", {
    dictation,
    confidence: dictation.confidence,
    words: dictation.words,
  });

  await updateRecording(params.id, {
    status: "transcribed",
    transcription: JSON.stringify(dictation),
    rawTranscriptionValue: JSON.stringify(dictation),
  });

  console.log("entity updated");

  return {
    ok: true,
  };

  return json({}, { status: 200 });
};
