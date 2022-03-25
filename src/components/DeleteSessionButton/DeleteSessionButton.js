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
import { useAdminContext } from "../../context/admin-context";
import { db } from "../../firestore";
import { deleteSession } from "../../helpers/deleteSession";

export const DeleteSessionButton = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const { rounds, votes } = useAdminContext();
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <>
      <Button colorScheme="red" onClick={() => setIsOpen(true)}>
        Radera föreställning
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Session
            </AlertDialogHeader>

            <AlertDialogBody>
              Är du säker? Föreställningen försvinner för alltid.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Avbryt
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onClose();
                  //Deactivate the session to log all users out
                  updateDoc(sessionRef, { active: false, done: true });
                  deleteSession({ session, rounds, votes });
                }}
                ml={3}
              >
                Radera
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
