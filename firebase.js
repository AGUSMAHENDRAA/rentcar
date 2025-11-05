import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApfABON9rpLw39ShQ--BOsGdfQAioJouA",
  authDomain: "rentalcar-dd993.firebaseapp.com",
  projectId: "rentalcar-dd993",
  storageBucket: "rentalcar-dd993.appspot.com",
  messagingSenderId: "413207578021",
  appId: "1:413207578021:web:971630c251e39483d2544c",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
