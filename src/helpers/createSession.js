import { doc, setDoc, writeBatch } from "firebase/firestore";
import { ref, set, getDatabase } from "firebase/database";
import { db } from "../firestore";
import { v4 as uuidv4 } from "uuid";
import { INITIAL_CANDIDATES } from "../constants/CANDIDATES_TOOLKIT";

export const createSession = async (data) => {
  const database = getDatabase();

  //Set up of init values of a session.
  const active = false;
  const done = false;
  const createdAt = 0;
  const updatedAt = 0;
  const sessionID = uuidv4();
  const candidatesLeft = INITIAL_CANDIDATES;
  const city = data.city;
  const showDate = data.showDate;
  const stage = data.stage;
  const secretWord = data.secretWord;

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
    console.error("Error setting RTDB value to 60: ", e);
  }

  //Create session and rounds in firestore.
  try {
    const batch = writeBatch(db);
    const sessionRef = doc(db, "sessions", sessionID);

    batch.set(sessionRef, {
      done: done,
      active: active,
      city: city,
      showDate: showDate,
      stage: stage,
      secretWord: secretWord,
      sessionID: sessionID,
      createdAt: createdAt,
      updatedAt: updatedAt,
      candidatesLeft: candidatesLeft,
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
