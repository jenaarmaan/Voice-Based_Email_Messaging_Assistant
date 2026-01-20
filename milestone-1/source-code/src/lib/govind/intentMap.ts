export type GovindIntent =
  | "REGISTER"
  | "LOGIN"
  | "LOGOUT"
  | "HELP"
  | "CANCEL"
  | "STOP_LISTENING"
  | "NAVIGATE"
  | "UNKNOWN";

const intentPatterns: Record<GovindIntent, string[]> = {
  REGISTER: [
    "new here",
    "create account",
    "register",
    "sign up",
    "no account",
    "don't have an account",
  ],
  LOGIN: [
    "log me in",
    "sign in",
    "login",
    "i have an account",
  ],
  LOGOUT: ["logout", "sign out"],
  HELP: ["help", "what can you do"],
  CANCEL: ["cancel", "never mind", "stop", "abort"],
  STOP_LISTENING: ["stop listening", "go silent"],
  NAVIGATE: ["go to", "open"],
  UNKNOWN: [],
};

export function detectIntent(text: string): {
  intent: GovindIntent;
  confidence: number;
} {
  const normalized = text.toLowerCase();

  for (const intent in intentPatterns) {
    for (const phrase of intentPatterns[intent as GovindIntent]) {
      if (normalized.includes(phrase)) {
        return { intent: intent as GovindIntent, confidence: 0.8 };
      }
    }
  }

  return { intent: "UNKNOWN", confidence: 0.2 };
}
