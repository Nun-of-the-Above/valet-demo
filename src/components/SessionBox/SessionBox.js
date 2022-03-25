import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/layout";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Spinner,
} from "@chakra-ui/react";
import { collection, doc, updateDoc } from "@firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAdminContext } from "../../context/admin-context";
import { db } from "../../firestore";
import { DeleteSessionButton } from "../DeleteSessionButton";
import { RoundBox } from "../RoundBox";

export function SessionBox({ session }) {
  const { rounds, sessions } = useAdminContext();
  const [activeSession, setActiveSession] = useState(null);
  const [allRoundsDone, setAllRoundsDone] = useState(false);

  useEffect(() => {
    if (!sessions) return;
    const anActiveSession = sessions.find((s) => s.active === true);
    if (anActiveSession) {
      setActiveSession(anActiveSession);
    }
  }, [sessions, activeSession]);

  //TODO: Button still enabled. Don't know how to fix this yet. Something todo with refresh cycles.
  useEffect(() => {
    if (!rounds) return;
    const doneAndClosed = rounds
      .filter((r) => r.parentSessionID === session.sessionID)
      .every((r) => r.done === true && r.roundActive === false);
    if (doneAndClosed) {
      setAllRoundsDone(true);
    }
  }, [rounds, allRoundsDone, session]);

  return (
    <>
      {!session ? (
        <Spinner />
      ) : (
        <Box
          className="flex-col p-3 mb-10 rounded-md"
          bgColor={session.active ? "green.100" : "gray.100"}
          border={session.active ? "3px solid green" : "1px solid black"}
        >
          <Heading as="h2" size="lg" className="text-center ">
            {new Date(session.showDate).toDateString()}, {session.stage},{" "}
            {session.city}
          </Heading>
          <SessionInfoBox session={session} />

          <HStack className="justify-around w-full my-8">
            <ActivateSessionButton session={session} disabled={activeSession} />
            <DeactivateSessionButton
              session={session}
              disabled={!allRoundsDone}
            />
            {/* <SetSessionDoneButton session={session} disabled={activeSession} /> */}
            <DeleteSessionButton session={session} />
          </HStack>

          <HStack className="justify-between">
            {rounds &&
              rounds
                .filter((round) => round.parentSessionID === session.sessionID)
                .map((round, i, rounds) => {
                  let shouldBeActive = false;
                  const roundsSorted = rounds
                    .map((round) => round)
                    .sort((a, b) => a[0] - b[0]);

                  const roundBefore = roundsSorted[round.number - 1];

                  if (round.number === 0) {
                    shouldBeActive = true;
                  } else if (
                    roundBefore &&
                    roundBefore.done &&
                    !roundBefore.roundActive
                  ) {
                    shouldBeActive = true;
                  }

                  return (
                    <RoundBox
                      key={round.roundID}
                      round={round}
                      disabled={!session.active || !shouldBeActive}
                    />
                  );
                })}
          </HStack>
        </Box>
      )}
    </>
  );
}

const SessionInfoBox = ({ session }) => {
  return (
    <Flex className="justify-between p-2 border-2 border-black rounded-lg">
      <Flex className="flex-col">
        <Text>
          <span className="font-bold">Status:</span>{" "}
          {session.active ? "Öppen" : "Stängd"}
        </Text>
        <Text>
          <span className="font-bold">Speldatum:</span>
          {new Date(session.showDate).toLocaleString()}
        </Text>
      </Flex>
      <Flex className="flex-col">
        <Text>
          <span className="font-bold">Scen:</span> {session.stage}
        </Text>
        <Text>
          <span className="font-bold">Stad:</span> {session.city}
        </Text>
      </Flex>
      <Flex className="flex-col">
        <Text>
          <span className="font-bold">Genomförd:</span>{" "}
          {session.done ? "Ja" : "Nej"}
        </Text>
        <Text>
          <span className="font-bold">Hemligt ord:</span> {session.secretWord}
        </Text>
      </Flex>
    </Flex>
  );
};

const ActivateSessionButton = ({ session, disabled }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <Button
      colorScheme={"green"}
      disabled={session.active || session.done || disabled}
      onClick={() => {
        updateDoc(sessionRef, { active: true });
      }}
    >
      ÖPPNA FÖRESTÄLLNING
    </Button>
  );
};

const SetSessionDoneButton = ({ session, disabled }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <Button
      onClick={() => {
        updateDoc(sessionRef, { done: true });
      }}
      disabled={disabled}
    >
      Sätt till klar och visa sista bild
    </Button>
  );
};

const DeactivateSessionButton = ({ session, disabled }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  return (
    <>
      <Button
        colorScheme="red"
        disabled={!session.active || disabled}
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
    </>
  );
};
