import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZsfoGKcn8N4bm7Z960zXfg6NDqAh6ihI",
  authDomain: "totfansitedb.firebaseapp.com",
  databaseURL: "https://totfansitedb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "totfansitedb",
  storageBucket: "totfansitedb.appspot.com",
  messagingSenderId: "963480836149",
  appId: "1:963480836149:web:4eeecd547a75efb26ab97c",
  measurementId: "G-L4MX7LPE59"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, auth, analytics, db };
