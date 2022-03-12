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
            <Heading>ADMIN DASHBOARD</Heading>
          </Center>
          <HStack margin="3" spacing="3">
            <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
              Skapa ny föreställning
            </Button>
            <Button onClick={logout}>Logga ut</Button>
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
              Föreställningar
            </Heading>
          </Center>
          {sessions ? (
            sessions.map((session) => (
              <SessionBox key={session.sessionID} session={session} />
            ))
          ) : (
            <p>Det finns inga föreställningar.</p>
          )}
        </>
      ) : (
        <Heading>Laddar admin dashboard...</Heading>
      )}
    </>
  );
}
