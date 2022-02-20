import { collection, doc, writeBatch, updateDoc } from "@firebase/firestore";
import { db } from "../../firestore";
import { RoundBox } from "../RoundBox";
import { Center, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useAdminContext } from "../../context/admin-context";

export function SessionBox({ session }) {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);
  const { rounds, votes } = useAdminContext();

  //Delete session and related rounds and votes.
  //TODO: Explore if this can be moved out into a helper function.
  const deleteSession = async () => {
    try {
      const batch = writeBatch(db);
      const roundsOwnedBySession = rounds.filter(
        (r) => r.parentSessionID === session.sessionID
      );

      // Schedule all rounds for deletion.
      roundsOwnedBySession.forEach((round) => {
        const roundRef = doc(db, "rounds", round.roundID);
        batch.delete(roundRef);
        console.log(
          `Round added to batch for delete. RoundID: ${round.roundID}`
        );

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

  return (
    <>
      {!session ? (
        <Heading>Loading session...</Heading>
      ) : (
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

          <Center>
            <HStack className="justify-between">
              {rounds &&
                rounds
                  .filter(
                    (round) => round.parentSessionID === session.sessionID
                  )
                  .map((round) => (
                    <RoundBox
                      key={round.roundID}
                      round={round}
                      disabled={!session.active}
                    />
                  ))}
            </HStack>
          </Center>

          <Button
            colorScheme="red"
            onClick={deleteSession}
            width="full"
            margin="3"
          >
            DELETE SESSION
          </Button>
        </Flex>
      )}
    </>
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
