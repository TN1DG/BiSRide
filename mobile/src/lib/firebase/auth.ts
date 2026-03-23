import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import type { UserRole, UserProfile } from "@/lib/types";

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(credential.user, { displayName });

  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid,
    email,
    phone: "",
    displayName,
    photoURL: "",
    role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expoPushTokens: [],
    ...(role === "rider" && {
      vehicleType: "motorcycle",
      serviceAreas: [],
      pricePerKm: 100,
      bio: "",
      isAvailable: true,
      averageRating: 0,
      totalDeliveries: 0,
    }),
    ...(role === "business" && {
      businessName: displayName,
      businessAddress: "",
      businessCategory: "",
    }),
  });

  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
) {
  await setDoc(
    doc(db, "users", uid),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export { type User };
