import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../firestore";

// Batched delete of session, its rounds and all votes related to it.
// TODO: All users registered in firebase needs to be cleared as well.
export const deleteSession = async ({ rounds, session, votes }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);
  try {
    const batch = writeBatch(db);
    const roundsOwnedBySession = rounds.filter(
      (r) => r.parentSessionID === session.sessionID
    );

    // Schedule all rounds for deletion.
    roundsOwnedBySession.forEach((round) => {
      const roundRef = doc(db, "rounds", round.roundID);
      batch.delete(roundRef);
      console.log(`Round added to batch for delete. RoundID: ${round.roundID}`);

      // Schedule votes of each round for deletion as well.
      votes
        .filter((v) => v.roundID === round.roundID)
        .forEach((v) => {
          const voteRef = doc(db, "votes", v.voteID);
          batch.delete(voteRef);
        });
    });

    batch.delete(sessionRef);

    await batch.commit();

    console.log(
      "Batch of session/rounds/votes was successfully deleted in db."
    );
  } catch (e) {
    console.error("Error deleting session, rounds and votes: ", e);
  }
};
