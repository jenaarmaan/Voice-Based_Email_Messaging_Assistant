// src/services/gmailReplyGenerator.ts

/**
 * Generate AI-based reply drafts for an email
 * (AI provider can be swapped later)
 */

export type ReplyTone = "polite" | "short" | "professional";

interface ReplyInput {
  emailBody: string;
  sender: string;
  tone: ReplyTone;
}

/* ======================================================
   🔽 NEW: AI prompt builder (ADD-ON)
   ====================================================== */
function buildReplyPrompt(
  emailBody: string,
  sender: string,
  tone: ReplyTone
): string {
  return `
You are an email assistant.
Write a ${tone} reply to the following email.

Sender: ${sender}

Email content:
${emailBody}

Reply:
`;
}

/* ======================================================
   🔽 NEW: Abstract AI call layer (pluggable)
   ====================================================== */
async function callAIReplyGenerator(prompt: string) {
  // ⚠️ PLACEHOLDER AI LOGIC
  // This will be replaced with Gemini / OpenAI later

  const lines = prompt.split("\n").filter(Boolean);

  return lines.slice(-6).join("\n");
}

/* ======================================================
   🔽 EXISTING FUNCTION (UNCHANGED)
   ====================================================== */
export async function generateReplyDraft({
  emailBody,
  sender,
  tone,
}: ReplyInput) {
  // ⚠️ Placeholder logic (AI model integration later)

  let reply = "";

  switch (tone) {
    case "short":
      reply = `Hi ${sender},\n\nThanks for the update. I’ll get back to you shortly.\n\nBest regards`;
      break;

    case "professional":
      reply = `Dear ${sender},\n\nThank you for reaching out. I have reviewed your message and will respond with the necessary details shortly.\n\nSincerely`;
      break;

    case "polite":
    default:
      reply = `Hello ${sender},\n\nThank you for your message. I appreciate you keeping me informed. I will review this and respond soon.\n\nKind regards`;
      break;
  }

  /* ======================================================
     🔽 NEW: AI-READY ENHANCEMENT (NON-BREAKING)
     ====================================================== */

  try {
    const prompt = buildReplyPrompt(emailBody, sender, tone);
    const aiReply = await callAIReplyGenerator(prompt);

    // Prefer AI output if available
    if (aiReply && aiReply.length > 20) {
      reply = aiReply;
    }
  } catch (err) {
    // Silent fallback to existing logic
  }

  return {
    tone,
    draft: reply,
    editable: true,            // 🔽 NEW FLAG
    requiresConfirmation: true // 🔽 VOICE-SAFE
  };
}
