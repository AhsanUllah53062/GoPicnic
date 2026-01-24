import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function registerUser(
  email: string,
  password: string,
  username: string,
  city: string,
  gender: string,
  phone: string,
  dob: string,
) {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    username,
    city,
    gender,
    phone,
    dob,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    profileImage: "",
    favoritePlaces: [],
    preferences: [],
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  return await signOut(auth);
}
