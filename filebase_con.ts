// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB37QX2LzC1lvmVYAU4oOlz5YC2MhcOyxk",
  authDomain: "face-mach-picture.firebaseapp.com",
  projectId: "face-mach-picture",
  storageBucket: "face-mach-picture.appspot.com",
  messagingSenderId: "173963984386",
  appId: "1:173963984386:web:8ce25f701451aad0f7b11b",
  measurementId: "G-WBVE99DV1C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)