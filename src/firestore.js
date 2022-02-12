import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { debugToken } from "./debugToken";
const {
  initializeAppCheck,
  ReCaptchaV3Provider,
} = require("firebase/app-check");

const firebaseConfig = {
  apiKey: "AIzaSyBt9-jaNbY3Z98P_YZJmGEW56xSBb89TKA",
  authDomain: "valet-app-2ab35.firebaseapp.com",
  projectId: "valet-app-2ab35",
  storageBucket: "valet-app-2ab35.appspot.com",
  messagingSenderId: "363053276470",
  appId: "1:363053276470:web:1cf479399af2286b366797",
  measurementId: "G-F39P75W8Z7",
};
// eslint-disable-next-line no-restricted-globals
self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfAjlkeAAAAAKxuwZIRCFrdqiaJuGNqYlzfC1K6"),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

// eslint-disable-next-line no-restricted-globals
if (location.hostname === "localhost") {
  console.log("We are now on the localhost.");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export { app, db, functions };
