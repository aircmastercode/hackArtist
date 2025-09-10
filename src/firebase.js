// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Uncomment when needed
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATQIyNiJpVQTcFsASGfaPOwUFCgs5oLDo",
  authDomain: "art-artists.firebaseapp.com",
  projectId: "art-artists",
  storageBucket: "art-artists.firebasestorage.app",
  messagingSenderId: "611713138465",
  appId: "1:611713138465:web:891239a9e18d57752d0860",
  measurementId: "G-Y8GH5SLJF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Uncomment when needed

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Debug: Log Firebase configuration
console.log('Firebase initialized with project ID:', firebaseConfig.projectId);
console.log('Firebase app:', app);
console.log('Firebase auth:', auth);
console.log('Firebase db:', db);

export default app;
