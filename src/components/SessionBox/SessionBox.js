import { collection, doc, writeBatch, updateDoc } from "@firebase/firestore";
import { db } from "../../firestore";
import { RoundBox } from "../RoundBox";
import {
  Center,
  Flex,
  Heading,
  HStack,
  VStack,
  GridItem,
  Grid,
  Text,
  Box,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useAdminContext } from "../../context/admin-context";
import { Spinner } from "@chakra-ui/react";

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
        <Spinner />
      ) : (
        <Flex
          className="flex-col p-10 m-10 rounded-md"
          border="1px solid black"
        >
          <Heading as="h2" size="lg" className="mb-5 text-center">
            {new Date(session.showDate).toDateString()}, {session.stage},{" "}
            {session.city}
          </Heading>

          <Grid className="m-10" gridTemplateColumns={"2fr 1fr"}>
            <GridItem>
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
                className="m-5"
              >
                SET TO DONE
              </Button>
              <Button
                disabled={!session.active}
                onClick={() => {
                  updateDoc(sessionRef, { active: false });
                }}
              >
                DEACTIVATE SESSION
              </Button>
            </GridItem>
            <GridItem>
              <SessionInfoBox session={session} />
            </GridItem>
          </Grid>

          <HStack className="justify-between">
            {rounds &&
              rounds
                .filter((round) => round.parentSessionID === session.sessionID)
                .map((round) => (
                  <RoundBox
                    key={round.roundID}
                    round={round}
                    disabled={!session.active}
                  />
                ))}
          </HStack>

          {/* TODO: Add verification here for deletion. */}
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
    <Box className="p-5 border-2 border-black rounded-lg">
      <Text>
        <span className="font-bold">SessionID:</span> {session.sessionID}
      </Text>
      <Text>
        <span className="font-bold">Active:</span> {session.active.toString()}
      </Text>
      <Text>
        <span className="font-bold">ShowDate:</span>
        {new Date(session.showDate).toLocaleString()}
      </Text>
      <Text>
        <span className="font-bold">Stage:</span> {session.stage}
      </Text>
      <Text>
        <span className="font-bold">City:</span> {session.city}
      </Text>
      <Text>
        <span className="font-bold">Done:</span> {session.done.toString()}
      </Text>
      <Text>
        <span className="font-bold">SecretWord:</span> {session.secretWord}
      </Text>
    </Box>
  );
};
