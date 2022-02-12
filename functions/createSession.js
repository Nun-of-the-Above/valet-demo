const functions = require("firebase-functions");

const admin = require("firebase-admin");
const db = admin.firestore();
const INITIAL_CANDIDATES = ["Alina", "Isabelle", "Filip", "Simon"];
const uuid = require("uuid");

exports.createSession = functions.https.onCall(async (data, context) => {
  if (context.app === undefined) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called from an App Check verified app."
    );
  }

  const active = false;
  const done = false;
  const createdAt = 0;
  const updatedAt = 0;
  const sessionID = uuid.v4();
  const candidatesLeft = INITIAL_CANDIDATES;
  const city = data.city;
  const showDate = data.showDate;
  const stage = data.stage;
  const secretWord = data.secretWord;

  await db.collection("sessions").doc(sessionID).set({
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

  async function createRound(sessionID, number) {
    const roundID = number + "-" + sessionID;
    const voteCount = {
      Alina: 0,
      Isabelle: 0,
      Filip: 0,
      Simon: 0,
    };

    //Add round to firestore.
    await db.collection("rounds").doc(roundID).set({
      roundID: roundID,
      parentSessionID: sessionID,
      number: number,
      voteCount: voteCount,
      roundActive: false,
      votingActive: false,
      done: false,
      displayResults: false,
      timer: 10,
    });
  }

  createRound(sessionID, 1);
  createRound(sessionID, 2);
  createRound(sessionID, 3);
});
