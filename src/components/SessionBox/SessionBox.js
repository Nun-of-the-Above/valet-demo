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
  VStack,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useAdminContext } from "../../context/admin-context";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Spinner,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";

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
              <VStack spacing={4}>
                <ActivateSessionButton session={session} />
                <DeactivateSessionButton session={session} />
                <SetSessionDoneButton session={session} />
              </VStack>
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
        <span className="font-bold">Status:</span>{" "}
        {session.active ? "Öppen" : "Stängd"}
      </Text>
      <Text>
        <span className="font-bold">Speldatum:</span>
        {new Date(session.showDate).toLocaleString()}
      </Text>
      <Text>
        <span className="font-bold">Scen:</span> {session.stage}
      </Text>
      <Text>
        <span className="font-bold">Stad:</span> {session.city}
      </Text>
      <Text>
        <span className="font-bold">Genomförd:</span>{" "}
        {session.done ? "Ja" : "Nej"}
      </Text>
      <Text>
        <span className="font-bold">Hemligt ord:</span> {session.secretWord}
      </Text>
    </Box>
  );
};

const ActivateSessionButton = ({ session }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <Button
      colorScheme={"green"}
      disabled={session.active}
      onClick={() => {
        updateDoc(sessionRef, { active: true });
      }}
    >
      ÖPPNA FÖRESTÄLLNING
    </Button>
  );
};

const SetSessionDoneButton = ({ session }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <Button
      onClick={() => {
        updateDoc(sessionRef, { done: true });
      }}
      className="m-5"
    >
      Sätt till klar och visa sista bild
    </Button>
  );
};

const DeactivateSessionButton = ({ session }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  return (
    <div className="m-5">
      <Button
        colorScheme="red"
        disabled={!session.active}
        onClick={() => setIsOpen(true)}
      >
        Stäng föreställning
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Är du säker?
            </AlertDialogHeader>

            <AlertDialogBody>
              Alla användare kommer loggas ut. Föreställning sätts till
              "Genomförd".
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Avbryt
              </Button>
              <Button
                marginLeft="3"
                colorScheme={"red"}
                disabled={!session.active}
                onClick={() => {
                  onClose();
                  updateDoc(sessionRef, { active: false, done: true });
                }}
              >
                STÄNG FÖRESTÄLLNING
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};
