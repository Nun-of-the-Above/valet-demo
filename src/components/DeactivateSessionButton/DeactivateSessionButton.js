import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { collection, doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../../firestore";

export const DeactivateSessionButton = ({ session, disabled }) => {
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
        w={"full"}
      >
        STÄNG FÖRESTÄLLNING
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
