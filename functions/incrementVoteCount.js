const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

//Increment vote in correct round for each vote added.
exports.incrementVoteCount = functions.firestore
  .document("votes/{vote}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();

    const roundRef = db.doc(`rounds/${data.roundID}`);

    const roundSnap = await roundRef.get();

    const roundData = roundSnap.data();

    const updatedVoteCount = roundData.voteCount;
    updatedVoteCount[data.candidate] = updatedVoteCount[data.candidate] + 1;

    return roundRef.update({
      voteCount: updatedVoteCount,
    });
  });