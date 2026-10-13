import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import config from "../config.js";

const client = new SESClient({ region: config.sesRegion });

export async function sendEmail({ to, subject, text }) {
  if (!config.sesFromEmail || !to) return { skipped: true };
  return client.send(new SendEmailCommand({
    Source: config.sesFromEmail,
    Destination: { ToAddresses: [to] },
    Message: { Subject: { Data: subject, Charset: "UTF-8" }, Body: { Text: { Data: text, Charset: "UTF-8" } } },
  }));
}
