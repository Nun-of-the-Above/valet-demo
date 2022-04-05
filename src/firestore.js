import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCB7p911Q9X6-Q-FtVS1qUSl1MqEHqZdBc",
  authDomain: "valet-demo-b45dd.firebaseapp.com",
  projectId: "valet-demo-b45dd",
  databaseURL:
    "https://valet-demo-b45dd-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "valet-demo-b45dd.appspot.com",
  messagingSenderId: "992353467476",
  appId: "1:992353467476:web:75ef22ee1172f3505481c1",
  measurementId: "G-PD28ZK7S3R",
};

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
