const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

exports.calculateVotingResults = functions.https.onCall(
  async (data, context) => {
    const roundID = data.roundID;
    const roundRef = db.collection("rounds").doc(roundID);

    async function calculateLoserAndVoteCount() {
      //Get from db
      const doc = await roundRef.get();
      const data = doc.data();

      let sortedCount = Object.entries(data.voteCount).sort(
        (a, b) => a[1] - b[1]
      );

      //Pick first as loser.
      const loserVotes = sortedCount[0][1];

      //Find potential duplicate losers.
      const allDuplicateLosers = sortedCount.filter(
        ([name, votes]) => votes === loserVotes
      );

      //If there is only one loser and no duplicate we just return as is.
      if (allDuplicateLosers.length === 1) return sortedCount;

      //If the duplicates are 0 we want to compensate potential -1 on loser by incrementing all.
      if (loserVotes === 0) {
        sortedCount.forEach(
          ([name, votes], index) => (sortedCount[index] = [name, votes + 1])
        );
      }

      const randomIndex = Math.floor(Math.random() * allDuplicateLosers.length);
      const loserName = allDuplicateLosers[randomIndex][0];
      // const loserCount = allDuplicateLosers[randomIndex][1];

      //If there is a duplicate, we want to decrease one at random and then re-sort.
      //Mutating here is not good.
      sortedCount = sortedCount
        .map(([name, votes]) =>
          name === loserName ? [name, votes - 1] : [name, votes]
        )
        .sort((a, b) => a[1] - b[1]);

      return sortedCount;
    }

    try {
      const sortedCount = await calculateLoserAndVoteCount();
      const updatedCountObject = Object.fromEntries(sortedCount);
      functions.logger.info("Loser: ", sortedCount[0]);
      functions.logger.info("UpdatedVoteCount", updatedCountObject);

      await roundRef.update({
        loser: sortedCount[0],
        voteCount: updatedCountObject,
        votingActive: false,
        done: true,
      });
      functions.logger.info("Added loser in db: ", sortedCount[0]);
      functions.logger.info("Updated voteCount in db: ", updatedCountObject);
    } catch (e) {
      functions.logger.error("Could not save loser to db: ", e);
    }

    functions.logger.info("Exiting process.");
    return "Added votes";
  }
);
