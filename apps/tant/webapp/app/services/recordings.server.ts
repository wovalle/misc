import {
  createRecording,
  getRecording,
  updateRecording,
} from "../lib/directus";
import { getPresignedUrl } from "../lib/s3";

export const createRecordingAndPrepareForUpload = async (opts: {
  filename: string;
}) => {
  const datePrefix = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace("T", "-")
    .replace("Z", "")
    .replace(/\./g, "-");

  const fileKey = `${datePrefix}-${opts.filename}`;

  const url = await getPresignedUrl(fileKey);
  const recording = await createRecording(fileKey, url);

  return recording;
};

export const updateRecordingAfterUpload = async (id: string) => {
  const recording = await getRecording(id);

  if (!recording) {
    throw new Response("Recording not found", { status: 404 });
  }

  const updatedRecording = await updateRecording(id, {
    status: "uploaded",
  });

  return updatedRecording;
};
