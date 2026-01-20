export type GovindState =
  | "DORMANT"
  | "AWAKE"
  | "LISTENING"
  | "PROCESSING"
  | "RESPONDING"
  | "AWAITING_CONFIRMATION"
  | "EXECUTING"
  | "IDLE";

const allowedTransitions: Record<GovindState, GovindState[]> = {
  DORMANT: ["AWAKE"],
  AWAKE: ["LISTENING"],
  LISTENING: ["PROCESSING", "AWAITING_CONFIRMATION"],
  PROCESSING: ["RESPONDING"],
  RESPONDING: ["IDLE"],
  AWAITING_CONFIRMATION: ["EXECUTING", "LISTENING"],
  EXECUTING: ["IDLE"],
  IDLE: ["LISTENING"],
};

export function canTransition(
  from: GovindState,
  to: GovindState
): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function transitionState(
  current: GovindState,
  next: GovindState
): GovindState {
  if (!canTransition(current, next)) {
    console.warn(`Invalid Govind transition: ${current} → ${next}`);
    return current;
  }
  return next;
}
