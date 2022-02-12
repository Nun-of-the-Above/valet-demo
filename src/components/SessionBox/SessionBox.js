import { collection, doc, writeBatch, updateDoc } from "@firebase/firestore";
import { useSessionContext } from "../../context/session-context";
import { db } from "../../firestore";
import { v4 as uuidv4 } from "uuid";
import { RoundBox } from "../RoundBox";
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

export function SessionBox({ session }) {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  const { isLoaded, rounds, votes } = useSessionContext();

  //Delete session and related rounds and votes.
  const deleteSession = async () => {
    try {
      const batch = writeBatch(db);

      votes.forEach((vote) => {
        const voteRef = doc(db, "votes", vote.voteID);
        batch.delete(voteRef);
        console.log(`Vote added to batch for delete. VoteID: ${vote.voteID}`);
      });

      rounds.forEach((round) => {
        const roundRef = doc(db, "rounds", round.roundID);
        batch.delete(roundRef);
        console.log(
          `Round added to batch for delete. RoundID: ${round.roundID}`
        );
      });

      batch.delete(sessionRef);
      await batch.commit();
      console.log("Batch was successfully deleted in db.");
    } catch (e) {
      console.error("Error deleting session, rounds and votes: ", e);
    }
  };

  return (
    <Flex className="flex-col p-10 m-10" border="3px solid black">
      <Heading as="h2" size="lg">
        {new Date(session.showDate).toDateString()}, {session.stage},{" "}
        {session.city}
      </Heading>

      <SessionInfoBox session={session} />

      <Stack spacing="3" margin="3">
        <Button
          disabled={session.active}
          onClick={() => {
            updateDoc(sessionRef, { active: true });
          }}
        >
          ACTIVATE SESSION
        </Button>

        <Button
          disabled={session.done}
          onClick={() => {
            updateDoc(sessionRef, { done: true });
          }}
        >
          SET SESSION TO DONE
        </Button>
        <Button
          disabled={!session.active}
          onClick={() => {
            updateDoc(sessionRef, { active: false });
          }}
        >
          DEACTIVATE SESSION
        </Button>
      </Stack>

      {isLoaded && rounds ? (
        <Center>
          <HStack className="justify-between">
            {rounds.map((round) => (
              <RoundBox key={round.roundID} round={round} />
            ))}
          </HStack>
        </Center>
      ) : (
        <p>Rounds showed if session is active.</p>
      )}

      <Button
        colorScheme="red"
        disabled={!session.active}
        onClick={deleteSession}
        width="full"
        margin="3"
      >
        DELETE SESSION
      </Button>
    </Flex>
  );
}

const SessionInfoBox = ({ session }) => {
  return (
    <Stack className="p-5 border-8">
      <Text>SessionID: {session.sessionID}</Text>
      <Text>Active: {session.active.toString()}</Text>
      <Text>ShowDate: {new Date(session.showDate).toLocaleString()}</Text>
      <Text>Stage: {session.stage}</Text>
      <Text>City: {session.city}</Text>
      <Text>Done: {session.done.toString()}</Text>
      <Text>SecretWord: {session.secretWord}</Text>
    </Stack>
  );
};
