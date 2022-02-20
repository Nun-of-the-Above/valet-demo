import { useAuth } from "../../context/auth-context";
import { SessionBox } from "../../components/SessionBox";
import { CreateSessionForm } from "../../components/CreateSessionForm/CreateSessionForm";
import { useRef } from "react";
import { Center, Heading, HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { useAdminContext } from "../../context/admin-context";

export function AdminPanel() {
  const { logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const { sessions, isLoaded } = useAdminContext();

  return (
    <>
      {isLoaded ? (
        <>
          <Center>
            <Heading>ADMIN VIEW</Heading>
          </Center>
          <HStack margin="3" spacing="3">
            <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
              Create new session
            </Button>
            <Button onClick={logout}>Admin log out</Button>
          </HStack>
          <CreateSessionForm
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={btnRef}
            size="md"
          />
          <Center>
            <Heading padding="3" size="lg">
              SESSIONS
            </Heading>
          </Center>
          {sessions ? (
            sessions.map((session) => (
              <SessionBox key={session.sessionID} session={session} />
            ))
          ) : (
            <p>There are no sessions.</p>
          )}
        </>
      ) : (
        <Heading>Loading admin view...</Heading>
      )}
    </>
  );
}
