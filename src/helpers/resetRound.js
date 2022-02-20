import {
  collection,
  doc,
  getDoc,
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firestore";

export const resetRound = async (round, voteCount, votesOwnedByRound) => {
  //WHAT I WANT
  //Get the loser from the voteCount attached to round.voteCount.
  //Add loser back into candidatesInRound of THIS round.
  //Add loser back into candidatesInRound of FUTURE rounds.
  //Add loser back into session.candidatesLeft.
  //Delete all votes with vote.roundID === round.roundID
  //Reset timer in localStorage
  //Reset state on round (done, active, votingActive etc)
  const loserName = voteCount.sort((a, b) => a[1] - b[1])[0][0];

  try {
    const batch = writeBatch(db);

    //Schedule all votesOwnedByRound for deletion in the batch.
    votesOwnedByRound.forEach((vote) => {
      const voteRef = doc(db, "votes", vote.voteID);
      batch.delete(voteRef);
    });

    // const roundRef = doc(db, "rounds", round.roundID);

    // //Add loser back into candidatesLeft in the session.
    // const sessionRef = doc(db, "sessions", round.parentSessionID);
    // const sessionSnapshot = await getDoc(sessionRef);
    // const session = sessionSnapshot.data();

    // //If loser is already in candidatesLeft, don't add them back in.
    // const updatedCandidatesLeft = session.candidatesLeft.includes(loserName)
    //   ? session.candidatesLeft
    //   : [...session.candidatesLeft, loserName];

    // batch.update(sessionRef, {
    //   candidatesLeft: updatedCandidatesLeft,
    // });

    // //Add loser back into THIS round.
    // batch.update(roundRef, {
    //   candidatesInRound: [...round.candidatesInRound, loserName],
    //   roundActive: false,
    //   votingActive: false,
    //   done: false,
    //   displayResults: false,
    // });

    // //Get all rounds
    // const q = query(
    //   collection(db, "rounds"),
    //   where("parentSessionID", "==", session.sessionID)
    // );
    // let rounds = [];
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => rounds.push(doc.data()));

    // //Filter to only undone rounds.
    // const futureRounds = rounds.filter((round) => !round.done);

    // //Add loser back into FUTURE rounds.
    // futureRounds.forEach((futureRound) => {
    //   const futureRoundRef = doc(db, "rounds", futureRound.roundID);
    //   const updatedCandidatesInRound = futureRound.candidatesInRound.includes(
    //     loserName
    //   )
    //     ? futureRound.candidatesInRound
    //     : [...futureRound.candidatesInRound, loserName];

    //   batch.update(futureRoundRef, {
    //     candidatesInRound: updatedCandidatesInRound,
    //   });
    // });

    batch.commit();

    console.log("Successful reset of round.");
  } catch (e) {
    console.error("Error when resetting round: ", e);
  }
};
