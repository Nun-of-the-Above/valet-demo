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
import { useRef, useState } from "react";

export function SessionBox({ session }) {
  const { rounds } = useAdminContext();

  return (
    <>
      {!session ? (
        <Spinner />
      ) : (
        <Flex className="flex-col p-3 m-10 rounded-md" border="1px solid black">
          <Heading as="h2" size="lg" className="text-center ">
            {new Date(session.showDate).toDateString()}, {session.stage},{" "}
            {session.city}
          </Heading>
          <SessionInfoBox session={session} />

          <HStack className="justify-around w-full my-8">
            <ActivateSessionButton session={session} />
            <DeactivateSessionButton session={session} />
            <SetSessionDoneButton session={session} />
            <DeleteSessionButton session={session} />
          </HStack>

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
        </Flex>
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
    <>
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
    </>
  );
};
