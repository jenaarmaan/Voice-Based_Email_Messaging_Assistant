// src/pages/Register.tsx

import { useEffect, useRef, useState } from "react";

import { useGovind } from "@/contexts/GovindContext";
import { Layout } from "@/components/layout/Layout";
import { CheckCircle2, AlertCircle } from "lucide-react";


const Register = () => {
  const { authStep, setRegistrationFaceImage } = useGovind();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 🔎 Mount confirmation (DEBUG — REQUIRED)
  useEffect(() => {
    console.log("[PAGE] Register mounted");
  }, []);

  /* ================= CAMERA SETUP (FACE ONLY) ================= */

  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (authStep !== "FACE") {
      setCountdown(null);
      // Cleanup camera if leaving FACE step
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      return;
    }

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        console.log("[CAMERA] Face capture started (Hands-Free)");

        // Start 3-second hands-free countdown
        setCountdown(3);
      } catch (err) {
        console.error("[CAMERA] Failed to access camera", err);
      }
    })();
  }, [authStep]);

  // ⏲️ Hands-Free Countdown Logic
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      captureFace();
      setCountdown(null);
    }
  }, [countdown]);


  /* ================= CAPTURE FACE ================= */

  const captureFace = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "face.jpg", { type: "image/jpeg" });
      setRegistrationFaceImage(file);

      // 🔐 Advance flow to VOICE_PIN
      window.dispatchEvent(new CustomEvent("govind:face", {
        detail: { result: "FACE_OK" }
      }));

      console.log("[CAMERA] Face image captured");
    }, "image/jpeg");
  };

  /* ================= UI ================= */

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-6 w-full max-w-md">
          <h1 className="text-3xl font-bold">
            🎙️ Voice Registration In Progress
          </h1>

          <p className="text-muted-foreground">
            Current step:
            <span className="ml-2 font-mono text-primary">
              {authStep}
            </span>
          </p>


          {/* ⏳ CONFIRMATION STEPS */}
          {authStep.startsWith("CONFIRM_") && (
            <div className="space-y-3">
              <AlertCircle className="mx-auto w-8 h-8 text-yellow-500" />
              <p className="text-sm font-medium">
                Please confirm
              </p>
              <p className="text-xs text-muted-foreground">
                Say <span className="font-semibold text-primary">yes</span> to confirm,
                or <span className="font-semibold text-primary">no</span> to repeat that step.
              </p>
            </div>
          )}

          {/* ✅ REGISTRATION COMPLETE */}

          {authStep === "COMPLETE" && (
            <div className="space-y-3">
              <CheckCircle2 className="mx-auto w-10 h-10 text-green-500" />
              <p className="text-sm font-medium">
                Registration complete
              </p>
              <p className="text-xs text-muted-foreground">
                Setting things up for you…
              </p>
            </div>
          )}


          {/* 📸 FACE CAPTURE — HANDS FREE */}
          {authStep === "FACE" && (
            <div className="space-y-4">
              <div className="relative rounded-lg border shadow-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full"
                />

                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="text-white text-6xl font-bold animate-ping">
                      {countdown}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  📸 Automatic capture in progress...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please keep your face clearly visible in the frame.
                </p>
              </div>
            </div>
          )}


          {/* ✨ FACE CAPTURED SUCCESS */}
          {(authStep === "VOICE_PIN" || authStep === "CONFIRM_VOICE_PIN") && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-600">
                Face Identity Secured
              </p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Register;
