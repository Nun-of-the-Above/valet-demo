import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useAdminContext } from "../../context/admin-context";
import { deleteSession } from "../../helpers/deleteSession";

export const DeleteSessionButton = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const { rounds, votes } = useAdminContext();

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
