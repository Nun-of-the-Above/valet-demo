import { doc, deleteDoc } from "@firebase/firestore";
import { db } from "../firestore";

export const deleteVoteForCandidate = async (candidate, votesOwnedByRound) => {
  const voteToDelete = votesOwnedByRound.find(
    (vote) => vote.candidate === candidate
  );
  try {
    await deleteDoc(doc(db, "votes", voteToDelete.voteID));
    console.log("Successfully deleted vote for", candidate);
  } catch {
    console.error("Failed to delete vote for", candidate);
  }
};
