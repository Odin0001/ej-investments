import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAmujxlyq84rYqJhTUVxFoQsh7XHnG3bCg',
  authDomain: 'investment-b9ecb.firebaseapp.com',
  projectId: 'investment-b9ecb',
  storageBucket: 'investment-b9ecb.firebasestorage.app',
  messagingSenderId: '940456559266',
  appId: '1:940456559266:web:86079af326da4dfd760dfb'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore()