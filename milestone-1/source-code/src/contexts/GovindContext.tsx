import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { detectIntent } from "@/lib/govind/intentMap";
import {
  startRegistration,
  handleRegisterSpeech,
  handleLoginSpeech,
  RegistrationSession,
} from "@/auth/authController";

/* ================= TYPES ================= */

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

type AuthMode = "LOGIN" | "REGISTER" | null;

type AuthStep =
  | "IDLE"
  | "EMAIL"
  | "CONFIRM_EMAIL"
  | "PASSWORD"
  | "APP_PASSWORD"
  | "FACE"
  | "VOICE_PIN"
  | "CONFIRM_PIN"
  | "PIN"
  | "COMPLETE";

interface GovindContextType {
  state: string;
  messages: Message[];
  isAssistantOpen: boolean;
  setIsAssistantOpen: (v: boolean) => void;
  assistantEnabled: boolean;
  enableAssistant: () => Promise<void>;

  speak: (text: string) => void;
  addMessage: (role: Message["role"], content: string) => void;
  setState: (s: string) => void;
  wakeUp: () => void;

  authMode: AuthMode;
  authStep: AuthStep;
  setAuthStep: (s: AuthStep) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  userName: string | null;
  setUserName: (v: string) => void;

  routeIntent: "/login" | "/register" | null;
  setRouteIntent: (route: "/login" | "/register" | null) => void;

  registrationSession: RegistrationSession | null;
  setRegistrationSession: (s: RegistrationSession | null) => void;
}

const GovindContext = createContext<GovindContextType | undefined>(undefined);

export const useGovind = () => {
  const ctx = useContext(GovindContext);
  if (!ctx) throw new Error("GovindContext missing");
  return ctx;
};

/* ================= PROVIDER ================= */

export const GovindProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState("DORMANT");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantEnabled, setAssistantEnabled] = useState(false);

  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [authStep, setAuthStep] = useState<AuthStep>("IDLE");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [routeIntent, setRouteIntent] =
    useState<"/login" | "/register" | null>(null);
  const [registrationSession, setRegistrationSession] =
    useState<RegistrationSession | null>(null);

  const recognitionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const isAwakeRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // ✅ Prevent stale authStep in async callbacks
  const authStepRef = useRef<AuthStep>("IDLE");

  useEffect(() => {
    authStepRef.current = authStep;
  }, [authStep]);

  /* ================= 🔓 AUTH MODE UNLOCK (FIX) ================= */
  useEffect(() => {
    if (authStep === "IDLE" && authMode === "REGISTER") {
      setAuthMode(null);
      setRegistrationSession(null);

      // ✅ IMPORTANT: return to normal listening mode
      setState("LISTENING");
    }
  }, [authStep, authMode]);

  /* ------------------ UTIL ------------------ */

  const addMessage = (role: Message["role"], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, content, timestamp: new Date() },
    ]);
  };

  /* ------------------ ENABLE ASSISTANT ------------------ */

  const enableAssistant = async () => {
    if (assistantEnabled) return;

    try {
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setAssistantEnabled(true);

      const utter = new SpeechSynthesisUtterance(
        "Govind voice assistant is now enabled."
      );
      utter.lang = "en-US";

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (err) {
      alert("Microphone access is required for Govind.");
      console.error(err);
    }
  };

  /* ------------------ SPEAK ------------------ */

  const speak = (text: string) => {
    addMessage("assistant", text);

    if (!assistantEnabled || isSpeakingRef.current) return;

    isSpeakingRef.current = true;
    setState("RESPONDING");

    try {
      recognitionRef.current?.stop();
    } catch {}

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";

    utter.onend = () => {
      isSpeakingRef.current = false;
      setState("LISTENING");

      setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch {}
      }, 300);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  /* ------------------ WAKE UP ------------------ */

  const wakeUp = () => {
    isAwakeRef.current = true;
    setState("AWAKE");
    setIsAssistantOpen(true);
  };

  /* ------------------ INTENT HANDLER ------------------ */

  const handleIntent = (text: string) => {
    setState("PROCESSING");

    const { intent } = detectIntent(text);

    if (intent === "REGISTER") {
      setAuthMode("REGISTER");
      const session = startRegistration({
        speak,
        setAuthStep: (s: string) => {
          authStepRef.current = s as AuthStep;
          setAuthStep(s as AuthStep);
        },
      });
      setRegistrationSession(session);
      setRouteIntent("/register");
      return;
    }

    if (intent === "LOGIN") {
      setAuthMode("LOGIN");
      speak("Alright. Let’s log you in.");
      setRouteIntent("/login");
      return;
    }

    speak("I am listening. Please continue.");
  };

  /* ------------------ SPEECH RECOGNITION ------------------ */

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      if (isSpeakingRef.current) return;

      const text =
        event.results[event.results.length - 1][0].transcript
          .trim()
          .toLowerCase();

      if (!assistantEnabled) return;

      if (!isAwakeRef.current) {
        if (text.includes("hey govind")) {
          wakeUp();
          speak("Yes, I am listening.");
        }
        return;
      }

      addMessage("user", text);

      if (authMode === "REGISTER" && registrationSession) {
        handleRegisterSpeech(
          text,
          registrationSession,
          setRegistrationSession,
          authStepRef.current,
          (step: string) => {
            authStepRef.current = step as AuthStep;
            setAuthStep(step as AuthStep);
          },
          speak
        );
        return;
      }

      if (authMode === "LOGIN") {
        handleLoginSpeech(
          text,
          authStepRef.current,
          (step: string) => {
            authStepRef.current = step as AuthStep;
            setAuthStep(step as AuthStep);
          },
          speak
        );
        return;
      }

      handleIntent(text);
    };

    recognitionRef.current = recognition;

    if (assistantEnabled) {
      try {
        recognition.start();
        setState("LISTENING");
      } catch {}
    }

    return () => recognition.stop();
  }, [assistantEnabled, authMode, registrationSession]);

  /* ------------------ PROVIDER ------------------ */

  return (
    <GovindContext.Provider
      value={{
        state,
        messages,
        isAssistantOpen,
        setIsAssistantOpen,
        assistantEnabled,
        enableAssistant,

        speak,
        addMessage,
        setState,
        wakeUp,

        authMode,
        authStep,
        setAuthStep,

        isAuthenticated,
        setIsAuthenticated,
        userName,
        setUserName,

        routeIntent,
        setRouteIntent,

        registrationSession,
        setRegistrationSession,
      }}
    >
      {children}
    </GovindContext.Provider>
  );
};
