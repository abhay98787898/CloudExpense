import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { createWorker } from "tesseract.js";
import config from "../config.js";

const s3 = new S3Client({ region: config.region });

export const analyzeReceipt = async (bucket, key) => {
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error("Receipt image could not be downloaded from S3");
  }

  const imageBuffer = await response.Body.transformToByteArray();

  const worker = await createWorker("eng");

  try {
    const result = await worker.recognize(Buffer.from(imageBuffer));
    return result.data.text;
  } finally {
    await worker.terminate();
  }
};