import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API,
  authDomain: "trace-taguig.firebaseapp.com",
  databaseURL:
    "https://trace-taguig-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trace-taguig",
  storageBucket: "trace-taguig.appspot.com",
  messagingSenderId: "902503184046",
  appId: "1:902503184046:web:2c3e4d431d75b237a51f3f",
  measurementId: "G-6VJ69RHBHE",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
signInWithEmailAndPassword(
  auth,
  import.meta.env.VITE_FIREBASE_EMAIL,
  import.meta.env.VITE_FIREBASE_PASSWORD
)
  .then((userCredential) => {
    // Signed in
    // const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    // const errorCode = error.code;
    // const errorMessage = error.message;
  });

export default firebaseApp;
