import { createDictation } from "../lib/assemblyai";
import { withCache } from "../lib/cache.server";
import {
  createTranscription,
  getRecording,
  updateRecording,
} from "../lib/directus";
import { getPresignedUrl } from "../lib/s3";

export const createAssemblyAiTranscription = async (recordingId: string) => {
  const recording = await getRecording(recordingId);

  if (!recording) {
    throw new Response("Recording not found", { status: 404 });
  }

  const recordingUrl = await withCache(
    ["presigned-url", recording.id],
    () =>
      getPresignedUrl(recording.id, {
        command: "read",
      }),
    { ttl: 1000 * 60 * 5 }
  );

  const dictation = await createDictation(recordingUrl);

  // TODO: Since db transcriptions might be cached, we need to bust the cache
  await createTranscription(
    recordingId,
    "assemblyai",
    JSON.parse(JSON.stringify(dictation))
  );

  console.log("got dictation", dictation);
  await updateRecording(recordingId, {
    status: "transcribed",
  });

  return dictation;
};
