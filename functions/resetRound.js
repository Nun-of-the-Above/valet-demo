const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// Resets the entire round and deletes corresponding votes.
//TODO: MOVE THIS TO LOCAL ADMIN INSTEAD
exports.resetRound = functions.https.onCall(async (data, context) => {
  const roundID = data.roundID;
  const parentSessionID = data.parentSessionID;
  functions.logger.info("Req body: " + data);
  functions.logger.info("SessionID : " + data.parentSessionID);

  const querySnapshot = await db.collection("votes").get();

  const votes = [];
  querySnapshot.forEach((doc) => votes.push(doc.data()));

  //TODO: Turn this into a batch with error check.
  votes
    .filter((vote) => vote.roundID === roundID)
    .forEach((vote) => {
      db.collection("votes")
        .doc(vote.voteID)
        .delete()
        .then(() => {
          functions.logger.info("Successful delete of vote.", {
            structuredData: true,
          });
        })
        .catch(() => {
          functions.logger.info("Error deleting docs", {
            structuredData: true,
          });
        });
    });

  const sessionDoc = await db.collection("sessions").doc(parentSessionID).get();
  const session = sessionDoc.data();
  const candidatesLeft = session.candidatesLeft;
  // const voteCountArray = candidatesLeft.map((name) => [name, 0]);
  // const voteCount = Object.fromEntries(voteCountArray);

  await db
    .collection("rounds")
    .doc(roundID)
    .update({
      roundActive: false,
      votingActive: false,
      done: false,
      displayResults: false,
      timer: 10,
    })
    .then(() =>
      functions.logger.info("Round was successfully reset.", {
        structuredData: true,
      })
    )
    .catch(() =>
      functions.logger.info("Error updating round", {
        structuredData: true,
      })
    );

  functions.logger.info("Candidates before push: ", candidatesLeft);
  functions.logger.info("VoteCount: ", data.voteCount);

  const loser = Object.entries(data.voteCount).sort((a, b) => a - b)[0];
  candidatesLeft.push(loser[0]);

  functions.logger.info("Candidates after push: ", candidatesLeft);

  await db
    .collection("sessions")
    .doc(parentSessionID)
    .update({ candidatesLeft: candidatesLeft });

  const queryRoundsSnapshot = await db.collection("rounds").get();

  const rounds = [];
  queryRoundsSnapshot.forEach((doc) => rounds.push(doc.data()));

  const remainingRounds = rounds.filter((round) => !round.done);

  remainingRounds.forEach((round) => {
    const voteCountArray = Object.entries(round.voteCount);
    const voteCountWithoutLoser = voteCountArray.filter(([candidateName]) =>
      candidatesLeft.includes(candidateName)
    );
    const voteCountObj = Object.fromEntries(voteCountWithoutLoser);

    db.collection("rounds")
      .doc(round.roundID)
      .update({
        voteCount: voteCountObj,
      })
      .then(() =>
        functions.logger.info(
          "Loser added to voteCount in round number ",
          round.number
        )
      )
      .catch(() => {
        functions.logger.info(
          "Failed to update voteCount in round number ",
          round.number
        );
      });
  });
});
