const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// exports.startTimer = functions.https.onCall((data, context) => {
//   functions.logger.info("This is the data recieved: ", data);

//   return "This is the startTimer function called!";
// });

exports.startTimer = functions.https.onCall(async (data, context) => {
  const roundID = data.roundID;
  functions.logger.info(data.roundID);

  const roundRef = db.doc(`rounds/${roundID}`);

  let count = 3;
  let sendObj = {};

  setInterval(() => {
    if (count === 0) {
      roundRef
        .update({ votingActive: false, done: true, timer: 0 })
        .then(() => {
          // CALCULATE LOSER HERE
          roundRef.get().then((snapshot) => {
            const round = snapshot.data();
            const sortedCount = Object.entries(round.voteCount).sort(
              (a, b) => a[1] - b[1]
            );

            //TODO: Fix callback hell with async/await.
            //TODO: Add the real names.
            //Same score, we randomly pick one.
            if (sortedCount[0][1] === sortedCount[1][1]) {
              //Gets random 0 or 1.
              const zeroOrOne = Math.floor(Math.random() * 2);
              const unTouchedMap = round.voteCount;

              const arrayOfRemainingCandidates = Object.keys(round.voteCount);

              //If loser is at 0 we increment all and then decrement loser back to 0.
              if (sortedCount[zeroOrOne][1] === 0) {
                arrayOfRemainingCandidates.forEach((name) => {
                  unTouchedMap[name] = unTouchedMap[name] + 1;
                });
              }

              //Decrement loser.
              const loserName = sortedCount[zeroOrOne][0];
              unTouchedMap[loserName] = unTouchedMap[loserName] - 1;

              //Updating loser with [candidate, votecount]
              roundRef
                .update({
                  loser: [loserName, unTouchedMap[loserName]],
                })
                .then(() => {
                  functions.logger.info(
                    "Timer ended. There was a tie! Successful stored random loser in db.",
                    {
                      structuredData: true,
                    }
                  );
                  roundRef
                    .update({
                      voteCount: unTouchedMap,
                    })
                    .then(() => {
                      process.exit(1);
                    });
                })
                .catch(() => {
                  functions.logger.info(
                    "There was a tie. Failed to store loser in db. Exiting process...",
                    {
                      structuredData: true,
                    }
                  );
                  process.exit(1);
                });
            } else {
              // If there is no tie, we just set index 0 as the loser after sort.
              roundRef
                .update({
                  loser: sortedCount[0],
                })
                .then(() => {
                  functions.logger.info(
                    "Timer ended. No tie. Successful stored loser in db. Exiting process...",
                    {
                      structuredData: true,
                    }
                  );

                  process.exit(1);
                })
                .catch(() => {
                  functions.logger.info("Something went wrong", {
                    structuredData: true,
                  });
                });
            }
          });
        });
    } else {
      functions.logger.info("CHANGING TIMER TO " + count, {
        structuredData: true,
      });
      sendObj["timer"] = count;
      roundRef.update(sendObj).then(() => count--);
    }
  }, 1000);
});
