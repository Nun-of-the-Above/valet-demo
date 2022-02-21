import { collection, doc, updateDoc } from "@firebase/firestore";
import { db } from "../../firestore";
import { RoundBox } from "../RoundBox";
import { DeleteSessionButton } from "../DeleteSessionButton";
import {
  Flex,
  Heading,
  HStack,
  GridItem,
  Grid,
  Text,
  Box,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useAdminContext } from "../../context/admin-context";
import { Spinner } from "@chakra-ui/react";

export function SessionBox({ session }) {
  const { rounds } = useAdminContext();

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
              <ActivateSessionButton session={session} />
              <SetSessionDoneButton session={session} />
              <DeactivateSessionButton session={session} />
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

          <DeleteSessionButton session={session} />
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

const ActivateSessionButton = ({ session }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <Button
      disabled={session.active}
      onClick={() => {
        updateDoc(sessionRef, { active: true });
      }}
    >
      ACTIVATE SESSION
    </Button>
  );
};

const SetSessionDoneButton = ({ session }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <Button
      disabled={session.done}
      onClick={() => {
        updateDoc(sessionRef, { done: true });
      }}
      className="m-5"
    >
      SET TO DONE
    </Button>
  );
};

const DeactivateSessionButton = ({ session }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <Button
      disabled={!session.active}
      onClick={() => {
        updateDoc(sessionRef, { active: false });
      }}
    >
      DEACTIVATE SESSION
    </Button>
  );
};
