import { v4 as uuidv4 } from 'uuid';

export const createExpenseItem = (userId, extractedData, receiptUrl, receiptKey) => {
  const timestamp = new Date().toISOString();
  const expenseId = `${timestamp}-${uuidv4()}`;

  return {
    userId, // PK
    expenseId, // SK
    createdAt: timestamp,
    receiptUrl, // Legacy field; fresh signed URLs are generated when expenses are fetched.
    ...(receiptKey ? { receiptKey } : {}),
    ...extractedData, // amount, date, merchant, category, rawText
  };
};
