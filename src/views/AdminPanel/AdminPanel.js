import { useAuth } from "../../context/auth-context";
import { SessionBox } from "../../components/SessionBox";
import { CreateSessionForm } from "../../components/CreateSessionForm/CreateSessionForm";
import { useRef } from "react";
import { Center, Heading, HStack, VStack, Grid, Flex } from "@chakra-ui/layout";
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
      <Heading>ADMIN DASHBOARD</Heading>
      {isLoaded ? (
        <Flex className="flex-col">
          <HStack className="">
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
          </HStack>
          <VStack>
            <Heading padding="3" size="lg">
              Föreställningar
            </Heading>
            {sessions ? (
              sessions.map((session) => (
                <SessionBox key={session.sessionID} session={session} />
              ))
            ) : (
              <p>Det finns inga föreställningar.</p>
            )}
          </VStack>
        </Flex>
      ) : (
        <Heading>Laddar admin dashboard...</Heading>
      )}
    </>
  );
}
