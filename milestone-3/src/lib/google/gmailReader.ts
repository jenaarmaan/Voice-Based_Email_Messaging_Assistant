// src/lib/google/gmailReader.ts

console.log("[GMAIL] gmailReader loaded");
import { getGmailClient } from "./gmailClient";

/**
 * Decode base64 Gmail message body
 */
function decodeBase64(data: string): string {
  return decodeURIComponent(
    atob(data.replace(/-/g, "+").replace(/_/g, "/"))
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

/**
 * Extract email body from Gmail payload
 */
function extractEmailBody(payload: any): string {
  if (!payload) return "";

  // Plain text preferred
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  // Multipart handling
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
    }
  }

  return "";
}

/**
 * Fetch latest inbox emails
 */
export async function fetchInbox(limit = 50) {
  console.log("[GMAIL] Fetching inbox emails (limit: " + limit + ")");

  let gmail;
  try {
    gmail = await getGmailClient();
  } catch (err) {
    console.warn("[GMAIL] Client unavailable", err);
    throw new Error("GMAIL_NOT_CONNECTED");
  }

  const res = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    maxResults: limit,
  });


  const messages = res.result.messages || [];

  const emails = await Promise.all(
    messages.map(async (msg: any) => {
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const headers = detail.result.payload.headers;

      const getHeader = (name: string) =>
        headers.find((h: any) => h.name === name)?.value || "";

      return {
        id: msg.id,
        threadId: detail.result.threadId,
        from: getHeader("From"),
        subject: getHeader("Subject"),
        date: getHeader("Date"),
        snippet: detail.result.snippet,
        isUnread: detail.result.labelIds?.includes("UNREAD"),
      };
    })
  );

  return emails;
}

/**
 * Fetch ONLY unread inbox emails
 */
export async function fetchUnreadInbox(limit = 10) {
  let gmail;
  try {
    gmail = await getGmailClient();
  } catch (err) {
    console.warn("[GMAIL] Client unavailable", err);
    return [];
  }

  const res = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX", "UNREAD"],
    maxResults: limit,
  });

  const messages = res.result.messages || [];

  if (messages.length === 0) return [];

  const emails = await Promise.all(
    messages.map(async (msg: any) => {
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "metadata",
      });

      const headers = detail.result.payload.headers;

      const getHeader = (name: string) =>
        headers.find((h: any) => h.name === name)?.value || "";

      return {
        id: msg.id,
        threadId: msg.threadId,
        from: getHeader("From"),
        subject: getHeader("Subject"),
        date: getHeader("Date"),
        snippet: detail.result.snippet,
        read: false,
      };
    })
  );

  return emails;
}

/**
 * Read full email content
 */
export async function readEmail(messageId: string) {
  let gmail;
  try {
    gmail = await getGmailClient();
  } catch {
    throw new Error("GMAIL_NOT_CONNECTED");
  }

  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });

  const payload = res.result.payload;
  const headers = payload.headers;

  const getHeader = (name: string) =>
    headers.find((h: any) => h.name === name)?.value || "";

  const body = extractEmailBody(payload);

  return {
    id: messageId,
    threadId: res.result.threadId,
    from: getHeader("From"),
    to: getHeader("To"),
    subject: getHeader("Subject"),
    date: getHeader("Date"),
    body,
  };
}

/**
 * Mark email as read
 */
export async function markEmailAsRead(messageId: string) {
  let gmail;
  try {
    gmail = await getGmailClient();
  } catch {
    return false;
  }

  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    removeLabelIds: ["UNREAD"],
  });

  return true;
}
