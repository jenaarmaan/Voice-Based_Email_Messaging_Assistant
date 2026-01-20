import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGovind } from "@/contexts/GovindContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Mic, CheckCircle2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const {
    authStep,
    setAuthStep,
    speak,
    setIsAuthenticated,
    setUserName,
  } = useGovind();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);

  /* ================= INITIAL LOGIN STEP ================= */

  useEffect(() => {
    // 🔐 Explicitly lock login flow
    setAuthStep("FACE");
    speak("Please look at the camera.");

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  /* ================= CAMERA (DUMMY FACE DETECTION) ================= */

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 🧪 Dummy face detection after 3s
      setTimeout(() => {
        setFaceDetected(true);

        // ✅ EXPLICIT STEP TRANSITION
        setAuthStep("PIN");
        speak("Face detected successfully. Please say your four digit voice PIN.");

        // stop camera
        stream.getTracks().forEach((t) => t.stop());
      }, 3000);
    } catch (err) {
      speak("Camera access denied. Please enable camera permissions.");
    }
  };

  /* ================= UI ================= */

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="rounded-2xl border p-8 mt-4 text-center">

            {/* FACE STEP */}
            {authStep === "FACE" && (
              <>
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-xl overflow-hidden bg-muted">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!faceDetected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-2 border-primary rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Looking for your face...
                </p>
              </>
            )}

            {/* PIN STEP */}
            {authStep === "PIN" && (
              <>
                <Mic className="mx-auto w-10 h-10 animate-pulse mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Listening for your four digit voice PIN...
                </p>

                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-10 h-12 border rounded flex items-center justify-center"
                      )}
                    >
                      •
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* COMPLETE */}
            {authStep === "COMPLETE" && (
              <>
                <CheckCircle2 className="mx-auto w-12 h-12 text-green-500 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Login successful!
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
