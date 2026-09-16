import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const endpoint = process.env.MINIO_ENDPOINT;
const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;
const bucket = process.env.MINIO_BUCKET;

if (!endpoint || !accessKey || !secretKey || !bucket) {
  throw new Error("MinIO environment variables are missing");
}

export const minio = new S3Client({
  endpoint,
  region: process.env.MINIO_REGION || "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

export async function ensureMinioBucket() {
  try {
    await minio.send(
      new HeadBucketCommand({
        Bucket: bucket,
      }),
    );
  } catch {
    await minio.send(
      new CreateBucketCommand({
        Bucket: bucket,
      }),
    );
  }
}

export async function uploadToMinio(
  key: string,
  buffer: Buffer,
  mimeType: string,
) {
  await minio.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );
}

export async function getFromMinio(key: string) {
  return minio.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function deleteFromMinio(key: string) {
  await minio.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
