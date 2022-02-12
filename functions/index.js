const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

if (process.env.NODE_ENV !== "production") {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.ORIGIN_URL = "http://localhost:3000";
}

if (process.env.NODE_ENV === "production") {
  process.env.ORIGIN_URL = "https://valet-app-2ab35.web.app";
}

const incrementVoteCount = require("./incrementVoteCount");
exports.incrementVoteCount = incrementVoteCount.incrementVoteCount;

const decrementVoteCount = require("./decrementVoteCount");
exports.decrementVoteCount = decrementVoteCount.decrementVoteCount;

const resetRound = require("./resetRound");
exports.resetRound = resetRound.resetRound;

const createSession = require("./createSession");
exports.createSession = createSession.createSession;

const calculateVotingResults = require("./calculateVotingResults");
exports.calculateVotingResults = calculateVotingResults.calculateVotingResults;

exports.createUserDocument = functions.auth.user().onCreate((user) => {
  db.collection("users")
    .doc(user.uid)
    .set(JSON.parse(JSON.stringify(user)));
});

exports.testTimer = functions.https.onCall((data, context) => {
  functions.logger.info();
  let counter = 5;
  const oneSecondTimer = setInterval(() => {
    counter--;
    functions.logger.info("Counter is now: ", counter);
    if (counter === 0) {
      functions.logger.info("REACHED ZERO. Clearing interval.");
      clearInterval(oneSecondTimer);
    }
  }, 1000);

  // while (counter !== 0) {
  // functions.logger.info("Counter is: ", counter);
  // }
  // functions.logger.info("REACHED ZERO. Clearing interval.");
  return "Timer was finished";
});
