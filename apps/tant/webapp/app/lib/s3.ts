import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getS3Client = () => {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });
};

export const getPresignedUrl = async (
  fileKey: string,
  opts?: {
    expiresIn?: number;
    command?: "read" | "upload";
  }
) => {
  const client = getS3Client();

  const command =
    opts?.command === "read"
      ? new GetObjectCommand({
          Bucket: process.env.R2_RECORDINGS_BUCKET_NAME,
          Key: fileKey,
        })
      : new PutObjectCommand({
          Bucket: process.env.R2_RECORDINGS_BUCKET_NAME,
          Key: fileKey,
        });

  console.log("getting presigned url...");
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: opts?.expiresIn ?? 3600,
  });

  return signedUrl;
};

export const getFile = async (id: string) => {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: process.env.R2_RECORDINGS_BUCKET_NAME,
    Key: id,
  });

  try {
    const response = await client.send(command);

    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    return await response?.Body?.transformToWebStream();
  } catch (err) {
    console.error(err);
  }
};
