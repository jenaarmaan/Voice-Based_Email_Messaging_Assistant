// src/services/gmailSummarizer.ts

/**
 * Max characters allowed for summarization
 */
const MAX_EMAIL_LENGTH = 4000;

/**
 * Truncate long email safely
 */
function truncateEmail(content: string): string {
  if (content.length <= MAX_EMAIL_LENGTH) return content;
  return content.slice(0, MAX_EMAIL_LENGTH) + "...";
}

/**
 * 🔽 NEW: Abstract AI call layer (pluggable)
 * Later this can be replaced with:
 * - Gemini API
 * - OpenAI
 * - Vertex AI
 */
async function callAISummarizer(content: string) {
  // ⚠️ PLACEHOLDER AI LOGIC - EXTRACT SENTENCES
  const cleanContent = content
    .replace(/^>.*$/gm, "")
    .replace(/\n+/g, " ")
    .trim();

  const sentences = cleanContent.match(/[^.!?]+[.!?]+/g) || [cleanContent];
  const summary = sentences.slice(0, 3).join(" ").trim();

  const bullets = sentences
    .slice(0, 5)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  return {
    summary: summary || "Content too short.",
    bullets,
  };
}

/**
 * Summarize email content using AI
 * (AI provider can be swapped later)
 */
export async function summarizeEmail(emailBody: string) {
  const safeContent = truncateEmail(emailBody);

  // 🔽 NEW: Central AI call (direct content)
  const aiResult = await callAISummarizer(safeContent);

  // 🔽 EXISTING OUTPUT SHAPE PRESERVED
  return {
    summary: aiResult.summary,
    bullets: aiResult.bullets,
  };
}
