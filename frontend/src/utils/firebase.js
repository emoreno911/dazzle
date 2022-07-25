import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: "dazzle-smartwallet-v1.firebaseapp.com",
    projectId: "dazzle-smartwallet-v1",
    storageBucket: "dazzle-smartwallet-v1.appspot.com",
    messagingSenderId: "539501087535",
    appId: "1:539501087535:web:8b7ed2fe7939fa19e1efda"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    console.log("User logged in")
    //console.log("User", user)
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

const logout = () => {
  signOut(auth);
}

window.logout10 = logout;

export {
  auth,
  signInWithGoogle,
  logout
};