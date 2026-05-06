import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseAuth() {
  if (typeof window === "undefined") {
    throw new Error("Firebase phone auth is only available in the browser.");
  }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}
