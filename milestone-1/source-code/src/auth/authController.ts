import React from "react";
import { normalizeEmail } from "@/services/emailNormalizer";
import { parseVoicePin } from "@/services/voicePinService";
import { saveUserRegistration } from "@/firebase/firestore";
/* ================= REGISTRATION SESSION ================= */

export interface RegistrationSession {
  email: string;
  password: string;
  appPassword: string;
  faceCaptured: boolean;
  voicePin: string;
}

export const createRegistrationSession = (): RegistrationSession => ({
  email: "",
  password: "",
  appPassword: "",
  faceCaptured: false,
  voicePin: "",
});

/* ================= REGISTRATION SPEECH HANDLER ================= */

export const handleRegisterSpeech = (
  text: string,
  session: RegistrationSession,
  setSession: React.Dispatch<React.SetStateAction<RegistrationSession>>,
  authStep: string,
  setAuthStep: (step: string) => void,
  speak: (msg: string) => void
): void => {
  const normalizedText = text.toLowerCase().trim();

  switch (authStep) {
    case "EMAIL": {
      const email = normalizeEmail(text);

      if (!email || !email.includes("@")) {
        speak("That does not sound like a valid email. Please say it again.");
        return;
      }

      setSession((prev) => ({ ...prev, email }));
      setAuthStep("CONFIRM_EMAIL");
      speak(`I heard ${email}. Is that correct?`);
      return;
    }

    case "CONFIRM_EMAIL": {
      if (
        normalizedText.includes("yes") ||
        normalizedText.includes("correct") ||
        normalizedText.includes("confirm")
      ) {
        setAuthStep("PASSWORD");
        speak("Great. Please say the password you want to set.");
        return;
      }

      if (normalizedText.includes("no") || normalizedText.includes("wrong")) {
        setAuthStep("EMAIL");
        speak("Okay. Please tell me your email address again.");
        return;
      }

      speak("Please say yes or no.");
      return;
    }

    case "PASSWORD": {
      setSession((prev) => ({ ...prev, password: text }));
      setAuthStep("APP_PASSWORD");
      speak("Got it. Now please tell me your app-specific password.");
      return;
    }

    case "APP_PASSWORD": {
      setSession((prev) => ({ ...prev, appPassword: text }));
      setAuthStep("FACE");
      speak("Perfect. Now I will register your face. Please look at the camera.");
      return;
    }

    case "FACE": {
      setSession((prev) => ({ ...prev, faceCaptured: true }));
      setAuthStep("VOICE_PIN");
      speak(
        "Face registered successfully. Now please say your four digit voice PIN."
      );
      return;
    }

    case "VOICE_PIN": {
      const result = parseVoicePin(text);

      if (!result.isValid || !result.pin) {
        speak("That does not sound like four digits. Please try again.");
        return;
      }

      setSession((prev) => ({ ...prev, voicePin: result.pin }));
      setAuthStep("CONFIRM_PIN");
      speak(`I heard ${result.pin.split("").join(" ")}. Is that correct?`);
      return;
    }

    case "CONFIRM_PIN": {
      if (
        normalizedText.includes("yes") ||
        normalizedText.includes("correct") ||
        normalizedText.includes("confirm")
      ) {
        setAuthStep("COMPLETE");
        speak("Perfect. Saving your registration now.");
        return;
      }

      if (normalizedText.includes("no") || normalizedText.includes("wrong")) {
        setAuthStep("VOICE_PIN");
        speak("Let's try again. Please say your four digit voice PIN.");
        return;
      }

      speak("Please say yes or no.");
      return;
    }

    /* ✅ EXACT FIX APPLIED HERE */
    case "COMPLETE": {
      speak("Registration complete. Welcome! You can now log in.");

      // ✅ clean exit from auth flow (SHORTER DELAY)
      setTimeout(() => {
        setAuthStep("IDLE");
      }, 300);

      return;
    }

    default:
      return;
  }
};

/* ================= LOGIN SPEECH HANDLER (FIXED & LOCKED) ================= */

export const handleLoginSpeech = (
  text: string,
  authStep: string,
  setAuthStep: (step: string) => void,
  speak: (msg: string) => void
): void => {
  // 🔒 Ignore speech during face detection
  if (authStep === "FACE") {
    return;
  }

  // 🔐 Voice PIN step
  if (authStep === "PIN") {
    const result = parseVoicePin(text);

    if (!result.isValid || !result.pin) {
      speak("That does not sound like four digits. Please try again.");
      return;
    }

    setAuthStep("COMPLETE");
    speak("PIN verified. You are now logged in.");

    // ✅ clean exit from login flow
    setTimeout(() => {
      setAuthStep("IDLE");
    }, 300);

    return;
  }
};

/* ================= REGISTRATION INITIALIZATION ================= */

export const startRegistration = (callbacks: {
  speak: (msg: string) => void;
  setAuthStep: (step: string) => void;
}): RegistrationSession => {
  const { speak, setAuthStep } = callbacks;

  speak("Let's create your account. First, please tell me your email address.");
  setAuthStep("EMAIL");

  return createRegistrationSession();
};
