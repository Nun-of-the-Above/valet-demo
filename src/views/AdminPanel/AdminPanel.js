import { useAuth } from "../../context/auth-context";
import { useSessionContext } from "../../context/session-context";
import { SessionBox } from "../../components/SessionBox";
import { v4 as uuidv4 } from "uuid";
import { CreateSessionForm } from "../../components/CreateSessionForm/CreateSessionForm";
import { useRef } from "react";
import { Center, Heading, HStack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";

export function AdminPanel() {
  const { user, logout } = useAuth();
  const { allSessions } = useSessionContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
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
      {allSessions && allSessions !== [] ? (
        allSessions.map((session) => (
          <SessionBox key={session.sessionID} session={session} />
        ))
      ) : (
        <p>There are no session.</p>
      )}
    </>
  );
}
