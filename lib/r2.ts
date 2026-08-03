import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type R2Configuration = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
};

export function isR2Configured() {
  return ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "NEXT_PUBLIC_R2_PUBLIC_URL"].every((key) => Boolean(process.env[key]));
}

export function getR2Configuration(): R2Configuration {
  if (!isR2Configured()) throw new Error("Cloudflare R2 is not configured");

  return {
    accountId: process.env.R2_ACCOUNT_ID!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    bucket: process.env.R2_BUCKET!,
    publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL!.replace(/\/$/, ""),
  };
}

function createR2Client(config: R2Configuration) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
}

export async function createProductMediaUpload(input: { key: string; contentType: string }) {
  const config = getR2Configuration();
  const uploadUrl = await getSignedUrl(
    createR2Client(config),
    new PutObjectCommand({ Bucket: config.bucket, Key: input.key, ContentType: input.contentType }),
    { expiresIn: 300 },
  );

  return { uploadUrl, publicUrl: `${config.publicUrl}/${input.key}` };
}
