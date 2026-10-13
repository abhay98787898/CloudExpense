export const parseExpenseData = (ocrText) => {
  const rawText = String(ocrText || "").trim();

  if (!rawText) return null;

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  // Try to identify the merchant from the first few lines.
  const merchant = lines
    .slice(0, 5)
    .find((line) =>
      /[a-zA-Z]/.test(line) &&
      !/receipt|invoice|tax invoice|bill no/i.test(line)
    ) || "Unknown";

  // Find the total amount, prioritizing lines labelled TOTAL or GRAND TOTAL.
  let total = 0;
  const totalLine = lines.find((line) =>
    /grand\s*total|total\s*amount|amount\s*due|net\s*total|total/i.test(line)
  );

  const amountPattern = /(?:₹|rs\.?|inr|\$)?\s*(\d[\d,]*(?:\.\d{1,2})?)/gi;
  const amountSource = totalLine || lines.slice(-5).join(" ");
  const amounts = [...amountSource.matchAll(amountPattern)];

  if (amounts.length) {
    total = Number(amounts[amounts.length - 1][1].replace(/,/g, "")) || 0;
  }

  // Extract a date from common receipt formats.
  const dateMatch = rawText.match(
    /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{1,2}-\d{1,2}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b/
  );

  const date = dateMatch ? formatDate(dateMatch[1]) : "";

  const category = detectCategory(merchant, rawText);

  return {
    total,
    date,
    merchant,
    category,
    rawText,
  };
};

export const formatDate = (value) => {
  if (!value) return "";

  let match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    return validDate(+match[1], +match[2], +match[3]);
  }

  match = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (match) {
    let day = +match[1];
    let month = +match[2];
    let year = +match[3];

    if (day <= 12 && month > 12) {
      [day, month] = [month, day];
    }

    if (year < 100) year += year < 50 ? 2000 : 1900;

    return validDate(year, month, day);
  }

  match = value.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    const months = {
      jan: 1, january: 1, feb: 2, february: 2,
      mar: 3, march: 3, apr: 4, april: 4,
      may: 5, jun: 6, june: 6, jul: 7, july: 7,
      aug: 8, august: 8, sep: 9, sept: 9, september: 9,
      oct: 10, october: 10, nov: 11, november: 11,
      dec: 12, december: 12,
    };

    const month = months[match[2].toLowerCase()];
    if (month) return validDate(+match[3], month, +match[1]);
  }

  return "";
};

const validDate = (year, month, day) => {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const detectCategory = (merchant, text) => {
  const value = `${merchant} ${text}`.toLowerCase();

  if (/restaurant|food|cafe|burger|pizza|bakery/i.test(value)) return "Food";
  if (/uber|ola|lyft|taxi|fuel|petrol|diesel/i.test(value)) return "Transport";
  if (/hotel|airbnb|flight|airlines/i.test(value)) return "Travel";
  if (/market|grocery|supermarket/i.test(value)) return "Groceries";

  return "General";
};