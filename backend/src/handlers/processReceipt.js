
import { analyzeReceipt } from "../utils/textract.js";
import { parseExpenseData } from "../utils/parser.js";
import { successResponse, errorResponse } from "../utils/response.js";
import config from "../config.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = config.uploadBucket;

const s3 = new S3Client({
  region: config.region,
});

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { key } = body;

    if (!key) {
      return errorResponse("Key is required", 400);
    }

    console.log(`Analyzing receipt: ${BUCKET_NAME}/${key}`);

    // 1. Extract receipt text using OCR
    const textractResponse = await analyzeReceipt(BUCKET_NAME, key);

    // 2. Parse extracted text
    const extractedData = parseExpenseData(textractResponse);

    if (!extractedData) {
      console.warn(`No expense data found for ${key}`);
      return errorResponse("No expense data found", 400);
    }

    console.log("Extracted Data:", extractedData);

    // 3. Generate a temporary URL for the private receipt
    const receiptUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }),
      { expiresIn: 300 }
    );

    // 4. Return extracted data for user review
    return successResponse({
      message: "Receipt scanned successfully",
      extracted: extractedData,
      receiptUrl,
      receiptKey: key,
      note: "Review the extracted data above. Use the Save Expense endpoint to save your changes.",
    });
  } catch (error) {
    console.error("Error processing receipt:", error);
    return errorResponse("Internal Server Error");
  }
};
