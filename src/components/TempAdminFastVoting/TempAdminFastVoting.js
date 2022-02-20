import { Button } from "@chakra-ui/button";
import { Grid } from "@chakra-ui/layout";
import { doc, setDoc } from "@firebase/firestore";
import { db } from "../../firestore";
import { v4 as uuidv4 } from "uuid";

export const TempAdminFastVoting = ({ round }) => {
  const addVote = async (candidate) => {
    const voteID = uuidv4();
    const randomUserEmail = `${uuidv4()}@gmail.com`;
    await setDoc(doc(db, "votes", voteID), {
      voteID: voteID,
      candidate: candidate,
      userEmail: randomUserEmail,
      roundID: round.roundID,
    });
  };

  return (
    <Grid templateColumns="1fr 1fr">
      {round.candidatesInRound
        .sort((a, b) => b - a)
        .map((candidate) => (
          <Button
            key={candidate}
            className="m-1 justify-self-center"
            onClick={() => addVote(candidate)}
          >
            Vote for {candidate}
          </Button>
        ))}
    </Grid>
  );
};
