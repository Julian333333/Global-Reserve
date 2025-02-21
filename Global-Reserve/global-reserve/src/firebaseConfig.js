// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAcCKf2wxbVbziTO47obFD6RVINVNESV7I",
    authDomain: "global-reserve.firebaseapp.com",
    projectId: "global-reserve",
    storageBucket: "global-reserve.firebasestorage.app",
    messagingSenderId: "576552633492",
    appId: "1:576552633492:web:d7363306c7a5fc319d6081",
    measurementId: "G-BEL3P8BJW3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence set to localStorage');
  })
  .catch((error) => {
    console.error('Auth persistence error:', error);
  });