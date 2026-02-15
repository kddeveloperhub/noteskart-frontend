import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2Mb6XC9RTk_yiR9N4CNcnw8StTSShJlk",
  authDomain: "noteskart-73586.firebaseapp.com",
  projectId: "noteskart-73586",
  storageBucket: "noteskart-73586.appspot.com",
  messagingSenderId: "755873716265",
  appId: "1:755873716265:web:9836a9afe7366e89e92438"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
