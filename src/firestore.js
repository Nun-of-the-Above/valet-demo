import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { firebaseConfig } from "./firebaseConfig";

// Check if app is initialized already.
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp(firebaseConfig);

const db = getFirestore(app);
const realTimeDb = getDatabase();

// Set up firebase emultators for local testing
// eslint-disable-next-line no-restricted-globals
if (location.hostname === "localhost") {
  console.log("We are now on the localhost.");
  connectFirestoreEmulator(db, "localhost", 8080);

  // Point to the RTDB emulator running on localhost.
  connectDatabaseEmulator(realTimeDb, "localhost", 9000);
}

export { app, db };
