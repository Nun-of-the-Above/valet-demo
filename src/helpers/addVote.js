import { doc, setDoc } from "@firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firestore";

// TODO: This should be a try/catch for error handling.
// Adds a new vote from a made-up user.
export const addVote = async ({ candidate, roundID }) => {
  const voteID = uuidv4();
  const randomUserEmail = `${uuidv4()}@gmail.com`;
  await setDoc(doc(db, "votes", voteID), {
    voteID: voteID,
    candidate: candidate,
    userEmail: randomUserEmail,
    roundID: roundID,
  });
};
