const getPresignedUrlApi = "https://willy.im/api/v1/upload-audio";
import * as FileSystem from "expo-file-system";

type UploadAudioResponse =
  | {
      error: string;
    }
  | { signedUrl: string; fileKey: string };

export const getPresignedUrl = async (
  filename: string
): Promise<UploadAudioResponse> => {
  // TODO: change to /get-presigned-url
  console.log("About to fetch presigned url api");
  return fetch(getPresignedUrlApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename,
      token: "desde_que_tu_me_engañaste",
    }),
  })
    .then((a) => a.json())
    .then((response) => {
      console.log("Got presigned url", response);

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
  console.log("uploading file....");
  const response = await FileSystem.uploadAsync(preSignedUrl, fileUri, {
    // fieldName: 'file',
    httpMethod: "PUT",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });

  console.log(JSON.stringify(response, null, 4));
  return response;
};
