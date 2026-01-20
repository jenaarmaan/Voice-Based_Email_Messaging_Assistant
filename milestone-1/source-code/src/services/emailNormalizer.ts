// src/services/emailNormalizer.ts

const digitWords: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const letterRegex = /^[a-z]$/;

export const normalizeEmail = (spoken: string): string => {
  let text = spoken.toLowerCase();

  // Remove common junk
  text = text
    .replace(/https?:\/\//g, "")
    .replace(/\bwww\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = text.split(" ");

  let result = "";
  let letterBuffer = "";

  for (const token of tokens) {
    // digit words → numbers
    if (digitWords[token]) {
      letterBuffer += digitWords[token];
      continue;
    }

    // single spelled letters
    if (letterRegex.test(token)) {
      letterBuffer += token;
      continue;
    }

    // flush buffer if needed
    if (letterBuffer) {
      result += letterBuffer;
      letterBuffer = "";
    }

    // separators
    if (token === "dot") {
      result += ".";
      continue;
    }
    if (
      token === "at" ||
      token === "rate" ||
      token === "atrate" ||
      token === "attherate"
    ) {
      result += "@";
      continue;
    }
    if (token === "underscore") {
      result += "_";
      continue;
    }
    if (token === "dash" || token === "hyphen") {
      result += "-";
      continue;
    }

    // normal word
    result += token;
  }

  if (letterBuffer) {
    result += letterBuffer;
  }

  return result.replace(/\s+/g, "");
};
