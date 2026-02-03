// src/services/emailDrafter.ts
import { callGemini } from "@/lib/ai/gemini";

export interface EmailDraft {
    subject: string;
    body: string;
}

export async function generateEmailDraft(userPrompt: string, existingSubject?: string): Promise<EmailDraft> {
    const prompt = `
    You are an AI assistant helping a user draft an email.
    The user said the following content for the email: "${userPrompt}"
    ${existingSubject ? `Note: The current subject is "${existingSubject}". If it looks like a reply (starts with Re:), keep it or refine it slightly.` : ""}
    
    Tasks:
    1. Generate a concise and professional subject line.
    2. Generate a well-structured and natural-sounding email body based on the content.
    
    IMPORTANT: Respond ONLY with a valid JSON object in the following format:
    {
      "subject": "...",
      "body": "..."
    }
    Do not include any other text or markdown formatting.
  `;

    const result = await callGemini(prompt);

    try {
        // Clean potential markdown code blocks
        const cleaned = result.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
            subject: parsed.subject || "No Subject",
            body: parsed.body || ""
        };
    } catch (e) {
        console.error("Failed to parse Gemini response for email draft:", result);
        // Fallback
        return {
            subject: "New Message",
            body: userPrompt
        };
    }
}
