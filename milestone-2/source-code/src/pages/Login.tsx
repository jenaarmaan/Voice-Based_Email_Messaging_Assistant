import { useEffect, useRef, useState } from "react";
import { useGovind } from "@/contexts/GovindContext";
import { Layout } from "@/components/layout/Layout";
import { Mic, CheckCircle2 } from "lucide-react";

const Login = () => {
  const { authStep, faceImageUrl } = useGovind();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [faceError, setFaceError] = useState(false);


  // 🎥 CAMERA LIFECYCLE
  useEffect(() => {
    if (authStep !== "FACE") {
      setCountdown(null);
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCountdown(2); // Swift 2-second countdown for login
      } catch (err) {
        console.error("[LOGIN] Camera access denied");
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [authStep]);

  // ⏲️ Hands-Free Logic
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      emitFaceResult("FACE_OK");
      setCountdown(null);
    }
  }, [countdown]);

  useEffect(() => {
    if (authStep !== "FACE") {
      setFaceError(false);
    }
  }, [authStep]);

  const emitFaceResult = (result: "FACE_OK" | "FACE_FAIL") => {
    console.log("[LOGIN] Face result:", result);
    if (result === "FACE_FAIL") {
      setFaceError(true);
    }
    window.dispatchEvent(
      new CustomEvent("govind:face", {
        detail: { result },
      })
    );
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-6 w-full max-w-2xl px-4">
          <h1 className="text-3xl font-bold">🔐 Voice Login In Progress</h1>

          <p className="text-muted-foreground">
            Current step:
            <span className="ml-2 font-mono text-primary">{authStep}</span>
          </p>

          {/* FACE STEP */}
          {authStep === "FACE" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                {/* LIVE FEED */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Feed</p>
                  <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-muted border-2 border-primary/20 shadow-xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {countdown !== null && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-white text-5xl font-bold animate-pulse">{countdown}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* REFERENCE IMAGE */}
                {faceImageUrl && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reference</p>
                    <div className="w-48 h-48 rounded-xl overflow-hidden bg-muted border-2 border-green-500/20 shadow-xl">
                      <img
                        src={faceImageUrl}
                        alt="Reference"
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <p className="text-sm text-muted-foreground">
                  {faceError ? "Verification failed. Please retry." : "Verifying identity... Please look at the camera."}
                </p>
                {faceError && (
                  <button
                    className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90"
                    onClick={() => setCountdown(2)}
                  >
                    Retry Auto-Scan
                  </button>
                )}
              </div>
            </div>
          )}


          {/* PIN STEP */}
          {authStep === "VOICE_PIN" && (
            <div className="space-y-4">
              <Mic className="mx-auto w-10 h-10 animate-pulse text-primary" />
              <p className="text-sm font-medium">Identity Verified</p>
              <p className="text-xs text-muted-foreground">
                Please say your four digit voice PIN to continue.
              </p>
            </div>
          )}

          {/* COMPLETE */}
          {authStep === "COMPLETE" && (
            <div className="space-y-4">
              <CheckCircle2 className="mx-auto w-12 h-12 text-green-500" />
              <p className="text-sm text-muted-foreground">Login successful!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Login;
