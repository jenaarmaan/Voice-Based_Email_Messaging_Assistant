// src/lib/google/gmailSender.ts

console.log("[GMAIL] gmailSender loaded");
import { getGmailClient } from "./gmailClient";

/**
 * Encode email content to base64url
 */
function encodeEmail(raw: string): string {
  // Robust base64url encoding for unicode
  const bytes = new TextEncoder().encode(raw);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

console.log("[GMAIL] Sending email via Gmail API");

/**
 * Send new email
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string
) {
  let gmail;
  try {
    gmail = await getGmailClient();
  } catch (err) {
    console.warn("[GMAIL] Send failed — Gmail not connected", err);
    throw new Error("GMAIL_NOT_CONNECTED");
  }

  const rawMessage = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body
  ].join("\r\n");

  const encodedMessage = encodeEmail(rawMessage);

  console.log("[GMAIL] Sending with payload:", { to, subject, bodyLength: body.length });

  try {
    const res = await gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: encodedMessage,
      },
    });
    console.log("[GMAIL] Send result:", res.status);
    return res.result;
  } catch (err: any) {
    console.error("❌ GAPI Send Error Details:", err.result?.error || err);
    throw err;
  }
}

/**
 * Reply to an existing email
 */
export async function replyToEmail(
  threadId: string,
  to: string,
  subject: string,
  body: string
) {
  let gmail;
  try {
    gmail = await getGmailClient();
  } catch (err) {
    console.warn("[GMAIL] Reply failed — Gmail not connected", err);
    throw new Error("GMAIL_NOT_CONNECTED");
  }

  const rawMessage = [
    `To: ${to}`,
    `Subject: Re: ${subject}`,
    `In-Reply-To: ${threadId}`,
    `References: ${threadId}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body
  ].join("\r\n");

  const encodedMessage = encodeEmail(rawMessage);

  try {
    const res = await gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: encodedMessage,
        threadId,
      },
    });
    console.log("[GMAIL] Reply result:", res.status);
    return res.result;
  } catch (err: any) {
    console.error("❌ GAPI Reply Error Details:", err.result?.error || err);
    throw err;
  }
}
