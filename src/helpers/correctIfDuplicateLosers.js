import {
  collection,
  doc,
  writeBatch,
  deleteDoc,
  where,
  query,
  getDocs,
} from "@firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firestore";

export const correctIfDuplicateLosers = async (
  round,
  voteCount,
  candidatesLeft,
  votesInActiveRound
) => {
  const sorted = voteCount.sort((a, b) => a[1] - b[1]);
  const losers = sorted.filter(([c, votes]) => votes === sorted[0][1]);

  const loserVoteCount = losers[0][1];

  const randomIndexOfLosers = Math.floor(Math.random() * losers.length);
  const nameOfRandomLoser = losers[randomIndexOfLosers][0];

  //Case 1: Single loser. Just return.
  if (losers.length === 1) return;

  //Case 2: Multiple losers and are >1.
  //Choose loser at random from losers, delete a vote for that candidate.
  if (loserVoteCount > 1) {
    const voteToDelete = votesInActiveRound.find(
      (vote) => vote.candidate === nameOfRandomLoser
    );
    try {
      await deleteDoc(doc(db, "votes", voteToDelete.voteID));
      console.log("Successfully deleted vote for", nameOfRandomLoser);
    } catch (e) {
      console.error("Failed to delete vote for", nameOfRandomLoser, e);
    }
  }

  //Case 3: Multiple losers with zero or one votes.
  if (loserVoteCount === 0 || loserVoteCount === 1) {
    const batch = writeBatch(db);
    try {
      //Add vote to all relevant candidates.
      console.log("CandidatesLeft at function: ", candidatesLeft);
      candidatesLeft.forEach((candidate) => {
        const voteID = uuidv4();
        const randomUserEmail = `${uuidv4()}@gmail.com`;
        batch.set(doc(db, "votes", voteID), {
          voteID: voteID,
          candidate: candidate,
          userEmail: randomUserEmail,
          roundID: round.roundID,
        });
      });

      await batch.commit();
      console.log("Added 1 vote to all.");

      const votesRef = collection(db, "votes");
      const q = query(votesRef, where("roundID", "==", round.roundID));

      const querySnapshot = await getDocs(q);
      let votesInRound = [];
      querySnapshot.forEach((doc) => votesInRound.push(doc.data()));

      //Choose loser at random from losers, delete one vote that has that candidate.
      const voteToDelete = votesInRound.find(
        (vote) => vote.candidate === nameOfRandomLoser
      );

      deleteDoc(doc(db, "votes", voteToDelete.voteID));
      console.log("Deleted 1 vote for", nameOfRandomLoser);
    } catch (e) {
      console.error("Failed to add one to all and then delete random vote.", e);
    }
  }
};
