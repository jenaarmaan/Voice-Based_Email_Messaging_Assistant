
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export const registerWithEmail = (
  email: string,
  password: string
) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};
