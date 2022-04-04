import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Heading, HStack, VStack, Center } from "@chakra-ui/layout";
import { useRef } from "react";
import { CreateSessionForm } from "../../components/CreateSessionForm/CreateSessionForm";
import { SessionBox } from "../../components/SessionBox";
import { useAdminContext } from "../../context/admin-context";
import { useAuth } from "../../context/auth-context";

export function AdminPanel() {
  const { logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const { sessions, isLoaded } = useAdminContext();

  return (
    <div className="text-center">
      <Heading>ADMIN DASHBOARD</Heading>
      {isLoaded ? (
        <div className="flex flex-col">
          <Center margin="3" spacing="3">
            <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
              Skapa ny föreställning
            </Button>
            <Button onClick={logout}>Logga ut</Button>
          </Center>
          <HStack>
            <CreateSessionForm
              isOpen={isOpen}
              placement="left"
              onClose={onClose}
              finalFocusRef={btnRef}
              size="md"
            />
          </HStack>
          {/* <Heading padding="3" size="lg" className="text-center">
            Föreställningar
          </Heading> */}
          <VStack spacing="10" marginBottom={10} className="m-4">
            {sessions ? (
              sessions
                .sort((a, b) => new Date(b.showDate) - new Date(a.showDate))
                .map((session) => (
                  <SessionBox key={session.sessionID} session={session} />
                ))
            ) : (
              <p>Det finns inga föreställningar.</p>
            )}
          </VStack>
        </div>
      ) : (
        <Heading>Laddar admin dashboard...</Heading>
      )}
    </div>
  );
}
