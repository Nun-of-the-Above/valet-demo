import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firestore";

// ? Should this entire thing be atomic? Complete success or complete fail.
export const updateCurrentCandidates = async (round, voteCount, rounds) => {
  const sessionRef = doc(db, "sessions", round.parentSessionID);
  const sessionSnapshot = await getDoc(sessionRef);
  const session = sessionSnapshot.data();

  //Cautionary sort and getting of loserName.
  const loserName = voteCount.sort((a, b) => a[1] - b[1])[0][0];

  // Remove loser from candidatesLeft
  const candidatesLeftWithoutLoser = session.candidatesLeft.filter(
    (c) => c !== loserName
  );

  // UPDATE SESSION WITH LOSER REMOVED
  try {
    updateDoc(sessionRef, {
      candidatesLeft: candidatesLeftWithoutLoser,
    });
    console.log("Successfully deleted user from session candidatesLeft");
  } catch (e) {
    console.error("Error updating session candidate list: ", e);
  }

  const remainingRoundsInSession = rounds.filter((round) => !round.done);

  // UPDATE FUTURE ROUNDS WITH LOSER REMOVED
  remainingRoundsInSession.forEach((round) => {
    const roundRef = doc(db, "rounds", round.roundID);

    // Update the candidatesInRound in db for each round.
    try {
      updateDoc(roundRef, {
        candidatesInRound: candidatesLeftWithoutLoser,
      });
      console.log(`Success updating candidateList in Round #${round.number}`);
    } catch (e) {
      console.error(
        `Failed to update candidateList of Round #${round.number}`,
        e
      );
    }
  });
};
