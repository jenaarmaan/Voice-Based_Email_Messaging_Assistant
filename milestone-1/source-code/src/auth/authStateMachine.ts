import { AuthSession } from "./authTypes";

export const createAuthSession = (): AuthSession => ({
  mode: "NONE",
  step: null,
  retries: 0,
  tempData: {},
});

export const resetAuthSession = (): AuthSession => ({
  mode: "NONE",
  step: null,
  retries: 0,
  tempData: {},
});

/* ================= REGISTRATION STEP DEFINITIONS ================= */

export const REGISTER_STEPS = [
  "EMAIL",
  "CONFIRM_EMAIL",
  "PASSWORD",
  "APP_PASSWORD",
  "FACE",
  "VOICE_PIN",
  "CONFIRM_PIN",
  "COMPLETE",
] as const;

export const getNextStep = (currentStep: string): string | null => {
  const idx = REGISTER_STEPS.indexOf(currentStep as any);
  if (idx === -1 || idx === REGISTER_STEPS.length - 1) return null;
  return REGISTER_STEPS[idx + 1];
};

export const getPreviousStep = (currentStep: string): string | null => {
  const idx = REGISTER_STEPS.indexOf(currentStep as any);
  if (idx <= 0) return null;
  return REGISTER_STEPS[idx - 1];
};
