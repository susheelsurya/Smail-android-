import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0Fn4NJN0jsiA4rt9fwp70cABpHFfLThU",
  authDomain: "smail-6.firebaseapp.com",
  projectId: "smail-6",
  storageBucket: "smail-6.firebasestorage.app",
  messagingSenderId: "817477407437",
  appId: "1:817477407437:web:35e4fe351b548e2e7ccf84",
  measurementId: "G-HC5RNXE4DB"
};
const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
});

export { app, db };
