import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGovind } from "@/contexts/GovindContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, CheckCircle2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const Register = () => {
  const navigate = useNavigate();
  const { registrationSession, authStep } = useGovind();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const email = registrationSession?.email || "";
  const voicePin = registrationSession?.voicePin || "";

  // redirect safety
  useEffect(() => {
    if (!registrationSession) navigate("/");
  }, [registrationSession, navigate]);

  // START CAMERA ON FACE STEP
  useEffect(() => {
    if (authStep !== "FACE") return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [authStep]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="rounded-2xl border p-8 mt-4">

            {(authStep === "EMAIL" || authStep === "CONFIRM_EMAIL") && (
              <div className="text-center">
                <Mic className="mx-auto w-10 h-10 animate-pulse mb-4" />
                <Input
                  value={email}
                  readOnly
                  placeholder="Your email will appear here"
                  className="text-center"
                />
              </div>
            )}

            {(authStep === "PASSWORD" || authStep === "APP_PASSWORD") && (
              <div className="text-center">
                <Mic className="mx-auto w-10 h-10 animate-pulse mb-4" />
                <p className="text-sm text-muted-foreground">
                  Listening securely...
                </p>
              </div>
            )}

            {authStep === "FACE" && (
              <div className="text-center">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-48 h-48 mx-auto rounded-xl object-cover"
                />
                <p className="mt-4 text-sm text-muted-foreground">
                  Capturing your face…
                </p>
              </div>
            )}

            {(authStep === "VOICE_PIN" || authStep === "CONFIRM_PIN") && (
              <div className="text-center">
                <Mic className="mx-auto w-10 h-10 animate-pulse mb-4" />
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-10 h-12 border rounded flex items-center justify-center",
                        voicePin[i] && "bg-primary/10"
                      )}
                    >
                      {voicePin[i] ? "•" : ""}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {authStep === "COMPLETE" && (
              <div className="text-center">
                <CheckCircle2 className="mx-auto w-12 h-12 text-green-500 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Registration complete!
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
