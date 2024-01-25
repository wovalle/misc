import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getPresignedUrl = async (fileKey: string) => {
  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });

  const signedUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: process.env.R2_RECORDINGS_BUCKET_NAME,
      Key: fileKey,
    }),
    { expiresIn: 3600 }
  );

  return signedUrl;
};
