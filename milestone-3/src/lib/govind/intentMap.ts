// src/lib/govind/intentMap.ts

export type IntentAction =
  | "READ"
  | "DRAFT"
  | "REPLY"
  | "SEND"
  | "SUMMARIZE"
  | "LOGIN"
  | "LOGOUT"
  | "REGISTER"
  | "OPEN_PLATFORM"
  | "VIEW_FOLDER"
  | "EXIT"
  | "UNKNOWN";

export type TargetPlatform = "gmail" | "outlook" | "telegram" | "whatsapp" | "system";

export interface ResolvedIntent {
  action: IntentAction;
  platform: TargetPlatform;
  text: string; // ✅ ADDED
  entities: {
    to?: string;
    subject?: string;
    body?: string;
    messageId?: string;
    query?: string;
  };
}

const intentPatterns: { action: IntentAction; platform: TargetPlatform; keywords: string[] }[] = [
  // Navigation (Specific first)
  { action: "OPEN_PLATFORM", platform: "gmail", keywords: ["open gmail", "go to gmail", "launch gmail"] },
  { action: "VIEW_FOLDER", platform: "gmail", keywords: ["open inbox", "go to inbox", "show inbox", "inbox"] },
  { action: "VIEW_FOLDER", platform: "gmail", keywords: ["open starred", "show starred", "starred", "favorites"] },
  { action: "VIEW_FOLDER", platform: "gmail", keywords: ["open sent", "show sent", "sent", "sent mail"] },
  { action: "VIEW_FOLDER", platform: "gmail", keywords: ["open drafts", "show drafts", "drafts"] },
  { action: "VIEW_FOLDER", platform: "gmail", keywords: ["open trash", "show trash", "trash", "deleted"] },
  { action: "VIEW_FOLDER", platform: "gmail", keywords: ["open spam", "show spam", "spam"] },

  // Actions
  { action: "READ", platform: "gmail", keywords: ["read", "check mail", "inbox", "new email", "what do i have", "open"] },
  { action: "SUMMARIZE", platform: "gmail", keywords: ["summarize", "summary", "digest", "what is it about"] },
  { action: "REPLY", platform: "gmail", keywords: ["reply", "respond", "answer"] },
  { action: "SEND", platform: "gmail", keywords: ["send", "compose", "write an email"] },

  // Auth
  { action: "LOGIN", platform: "system", keywords: ["login", "sign in", "log in"] },
  { action: "REGISTER", platform: "system", keywords: ["register", "sign up", "create account"] },
  { action: "LOGOUT", platform: "system", keywords: ["logout", "sign out"] },
  { action: "EXIT", platform: "system", keywords: ["exit", "stop", "close", "sleep"] },
];

/**
 * 🧠 3A. Intent Detection (STATELESS)
 * Classifies the transcript into an action and platform.
 */
export function detectIntent(text: string): ResolvedIntent {
  const normalized = text.toLowerCase().trim();

  // 1. Check patterns
  for (const pattern of intentPatterns) {
    if (pattern.keywords.some(k => normalized.includes(k))) {
      const entities: any = {};

      if (pattern.action === "VIEW_FOLDER") {
        if (normalized.includes("starred")) entities.query = "starred";
        else if (normalized.includes("sent")) entities.query = "sent";
        else if (normalized.includes("draft")) entities.query = "drafts";
        else if (normalized.includes("trash")) entities.query = "trash";
        else if (normalized.includes("spam")) entities.query = "spam";
        else entities.query = "inbox";
      }

      return {
        action: pattern.action,
        platform: pattern.platform,
        text,
        entities
      };
    }
  }

  // 2. Fallback
  return {
    action: "UNKNOWN",
    platform: "system",
    text,
    entities: { query: text }
  };
}


