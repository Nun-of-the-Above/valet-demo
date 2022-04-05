import { doc, writeBatch } from "firebase/firestore";
import { ref, set, getDatabase } from "firebase/database";
import { db } from "../firestore";
import { v4 as uuidv4 } from "uuid";
import { INITIAL_CANDIDATES } from "../constants/CANDIDATES_TOOLKIT";

// Creates a new session and rounds in firestore
export const createSession = async (data) => {
  const database = getDatabase();
  const sessionID = uuidv4();

  // Helper function for creating rounds.
  const getRoundObj = (sessionID, number) => ({
    roundID: number + "-" + sessionID,
    parentSessionID: sessionID,
    number: number,
    candidatesInRound: INITIAL_CANDIDATES,
    roundActive: false,
    votingActive: false,
    done: false,
    displayResults: false,
  });

  //Init timer in RTDB to 60 sec for the voting.
  try {
    set(ref(database, "timer/"), {
      value: 60,
    });
  } catch (e) {
    console.error("Error setting RTDB value to startvalue: ", e);
  }

  //Create session and rounds in firestore.
  try {
    const batch = writeBatch(db);
    const sessionRef = doc(db, "sessions", sessionID);

    batch.set(sessionRef, {
      done: false,
      active: false,
      city: data.city,
      showDate: data.showDate,
      stage: data.stage,
      secretWord: data.secretWord,
      sessionID: sessionID,
      candidatesLeft: INITIAL_CANDIDATES,
    });

    //TODO: Turn it into a helper function instead.
    const roundOneRef = doc(db, "rounds", 1 + "-" + sessionID);
    const roundTwoRef = doc(db, "rounds", 2 + "-" + sessionID);
    const roundThreeRef = doc(db, "rounds", 3 + "-" + sessionID);

    batch.set(roundOneRef, getRoundObj(sessionID, 1));
    batch.set(roundTwoRef, getRoundObj(sessionID, 2));
    batch.set(roundThreeRef, getRoundObj(sessionID, 3));

    await batch.commit();
  } catch (e) {
    console.error("Error creating new session: ", e);
  }
};
