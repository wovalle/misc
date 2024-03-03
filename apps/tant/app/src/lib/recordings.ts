// const tantapiBaseUrl = "https://tant-api-drab.vercel.app";
const tantapiBaseUrl = "http://localhost:3000";

import * as FileSystem from "expo-file-system";
import { recordingSchema } from "../shared/entities";

export const createRecording = async (filename: string) => {
  console.log("About to create recording");

  return fetch(tantapiBaseUrl + "/api/v0/recordings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_TANT_API_KEY!}`,
    },
    body: JSON.stringify({
      filename,
    }),
  })
    .then((a) => a.json())
    .then((a) => recordingSchema.parse(a.data))
    .then((response) => {
      console.log("got recording", response.id);

      return response;
    })
    .catch((e) => {
      console.log("Error", e);
      throw e;
    });
};

export const uploadFileToPresignedUrl = async (
  preSignedUrl: string,
  fileUri: string
) => {
  console.log("uploading file...");
  const response = await FileSystem.uploadAsync(preSignedUrl, fileUri, {
    httpMethod: "PUT",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });
  console.log("file uploaded successfully");

  return response;
};

export const updateRecording = async (id: string) => {
  console.log("updating recording....", id);

  return fetch(`${tantapiBaseUrl}/api/v0/recordings/${id}/uploaded`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_TANT_API_KEY!}`,
    },
  })
    .then((a) => a.json())
    .then((a) => recordingSchema.partial().parse(a.data))
    .then((response) => {
      console.log("Recording updated successfully");
    })
    .catch((e) => {
      console.log("Error updateRecordingUrl", e);
      throw e;
    });
};
