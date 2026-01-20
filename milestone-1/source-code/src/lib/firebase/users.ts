import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createUserProfile = async (
  uid: string,
  data: {
    email: string;
    name?: string;
    voicePinHash?: string;
    createdAt: Date;
  }
) => {
  return setDoc(doc(db, "users", uid), data);
};

export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};
