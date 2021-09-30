import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/analytics";

const config = {
  apiKey: "AIzaSyCA2Gi83b2KVKcrf5GCdQ4ZIomUSJMYsI8",
  authDomain: "open-marusho.firebaseapp.com",
  projectId: "open-marusho",
  storageBucket: "open-marusho.appspot.com",
  messagingSenderId: "76478453915",
  appId: "1:76478453915:web:78906e53f4b4d9069c8e3e",
  measurementId: "G-WNTBVPMBPE",
};

firebase.initializeApp(config);
firebase
  .auth()
  .signInAnonymously()
  .catch((error) => console.log(error));

export default firebase;
