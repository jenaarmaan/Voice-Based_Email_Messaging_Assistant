import { User } from "firebase/auth";
import {
  loginWithEmail,
  verifyFirebaseLoginSecurity,
} from "@/lib/firebase/auth";
/* ======================================================
   OPTIONAL BIOMETRIC EXTENSION (FUTURE-SAFE)
   ====================================================== */

/**
 * Optional hook for advanced biometric verification
 * (e.g., face embeddings, liveness detection)
 *
 * Currently NO-OP — returns true by default
 */
const verifyBiometricIdentity = async (
  user: User
): Promise<boolean> => {
  // 🔒 FUTURE IMPLEMENTATION ONLY
  return true;
};

/* ======================================================
   TYPES (AUTHORITATIVE)
   ====================================================== */

export type LoginResult =
  | { status: "OK"; user: User; faceImageUrl?: string }
  | { status: "NO_FACE" }
  | { status: "BAD_PIN"; faceImageUrl?: string }
  | { status: "AUTH_FAILED" };

/* ======================================================
   LOGIN PIPELINE — SINGLE SOURCE OF TRUTH
   ====================================================== */

/**
 * COMPLETE LOGIN FLOW
 *
 * ORDER (LOCKED — DO NOT CHANGE):
 * 1. Firebase email/password authentication
 * 2. Firestore security verification
 *    - face registered
 *    - voice PIN valid
 *
 * ❌ No UI logic
 * ❌ No mic logic
 * ❌ No TTS
 * ❌ No routing
 * ❌ No state mutation
 */
export const loginUserSecurely = async ({
  email,
  password,
  spokenPin,
}: {
  email: string;
  password: string;
  spokenPin: string;
}): Promise<LoginResult> => {
  try {
    /* ================= VALIDATION ================= */

    if (!email || !password || !spokenPin) {
      console.warn("[LOGIN FLOW] Missing credentials");
      return { status: "AUTH_FAILED" };
    }

    console.log("[LOGIN FLOW] Step 1: Firebase authentication");

    /* ================= STEP 1 ================= */

    const user = await loginWithEmail(email, password);

    if (!user) {
      console.warn("[LOGIN FLOW] Firebase auth failed");
      return { status: "AUTH_FAILED" };
    }

    console.log("[LOGIN FLOW] Step 2: Security verification");

    /* ================= STEP 2 ================= */

    const securityResult = await verifyFirebaseLoginSecurity(
      user,
      spokenPin
    );

    if (securityResult.status === "NO_FACE") {
      console.warn("[LOGIN FLOW] Face not registered");
      return { status: "NO_FACE" };
    }

    if (securityResult.status === "BAD_PIN") {
      console.warn("[LOGIN FLOW] Invalid voice PIN");
      return { status: "BAD_PIN", faceImageUrl: securityResult.faceImageUrl };
    }

    /* ================= OPTIONAL BIOMETRIC CHECK ================= */
    console.log("[LOGIN FLOW] ✅ Login successful");
    return { status: "OK", user, faceImageUrl: securityResult.faceImageUrl };

  } catch (err) {
    console.error("[LOGIN FLOW] ❌ Fatal login error", err);
    return { status: "AUTH_FAILED" };
  }
};
