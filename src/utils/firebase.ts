import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Firebase 설정 - 본인 Firebase Console에서 복사
const firebaseConfig = {
  apiKey: "AIzaSyBPamNXhk6psKK-nwPcez7VLqAwLSgVFUk",
  authDomain: "year-end-review-487f6.firebaseapp.com",
  databaseURL: "https://year-end-review-487f6-default-rtdb.firebaseio.com",
  projectId: "year-end-review-487f6",
  storageBucket: "year-end-review-487f6.firebasestorage.app",
  messagingSenderId: "217477499118",
  appId: "1:217477499118:web:e2c4825484c4394e4f4bff",
  measurementId: "G-VY1F7580WH",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Realtime Database 및 Auth 참조
export const database = getDatabase(app);
export const auth = getAuth(app);
