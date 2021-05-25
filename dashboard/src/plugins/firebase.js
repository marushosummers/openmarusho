import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/analytics";

const config = {
  // Input Your Config.
};

firebase.initializeApp(config);
export default firebase;
