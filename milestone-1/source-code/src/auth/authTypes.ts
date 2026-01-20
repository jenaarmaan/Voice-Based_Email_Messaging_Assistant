export type AuthMode = "NONE" | "LOGIN" | "REGISTER" | "LOGOUT";

export type LoginStep =
  | "FACE"
  | "VOICE_PIN"
  | "SUCCESS";

export type RegisterStep =
  | "EMAIL"
  | "PASSWORD"
  | "APP_PASSWORD"
  | "FACE"
  | "VOICE_PIN"
  | "COMPLETE";

export interface AuthSession {
  mode: AuthMode;
  step: LoginStep | RegisterStep | null;
  retries: number;
  tempData: Record<string, any>;
}
