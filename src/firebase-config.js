// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBaEN_FNbrpWJOZFzNG18Gjls6J0PA6NKk",
  authDomain: "soyung-gg.firebaseapp.com",
  databaseURL: "https://soyung-gg-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "soyung-gg",
  storageBucket: "soyung-gg.appspot.com",
  messagingSenderId: "545179229331",
  appId: "1:545179229331:web:df759aabb3f51489248166",
  measurementId: "G-KKZEW86738",
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
