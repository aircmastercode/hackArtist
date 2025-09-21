import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

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

// Firebase configuration is now directly embedded
console.log('🔥 Firebase configuration loaded for project:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
