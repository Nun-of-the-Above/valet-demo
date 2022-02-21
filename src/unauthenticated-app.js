import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Center, Container, Heading, Text } from "@chakra-ui/layout";
import { useState } from "react";
import { useAuth } from "./context/auth-context";
import { useSessionContext } from "./context/session-context";

export function UnauthenticatedApp() {
  const { login, registerWithRandomEmail } = useAuth();
  const { activeSession, isLoaded } = useSessionContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminShow, setAdminShow] = useState(false);

  const [secretWord, setSecretWord] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleRegisterRandom = (e) => {
    e.preventDefault();
    if (secretWord.toLowerCase() === activeSession.secretWord) {
      registerWithRandomEmail();
    } else {
      setError(true);
    }
  };

  return (
    <>
      {isLoaded ? (
        activeSession.active ? (
          <Container>
            <form onSubmit={(e) => handleRegisterRandom(e)}>
              <Heading size="md" className="mb-5 text-center">
                LÖSENORD
              </Heading>
              <Input
                className="mb-2"
                type="text"
                value={secretWord}
                onChange={(e) => {
                  setSecretWord(e.target.value);
                  setError(false);
                }}
              />
              <Center>
                <Button type="submit" className="m-2">
                  LOGGA IN
                </Button>
              </Center>
            </form>
            {error && <Text>Fel lösenord. Försök igen.</Text>}
          </Container>
        ) : (
          <p>Föreställningen hämtades men är inte igång.</p>
        )
      ) : (
        <Container className="text-center">
          <Heading size="md" as="h3">
            Ingen förställning spelas just nu.
          </Heading>
          <Text className="mt-5">
            Vänta på att föreställningen sätts igång.
          </Text>
        </Container>
      )}
      <Button
        position="fixed"
        bottom="0"
        margin="30px"
        onClick={() => setAdminShow(!adminShow)}
      >
        ADMIN
      </Button>
      {adminShow && (
        <Container>
          <Box position="fixed" bottom="50" margin="30px">
            <Heading as="h3">Admin Login</Heading>
            <form onSubmit={(e) => handleLogin(e)}>
              <Input
                placeholder="Username"
                variant="outline"
                value={email}
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                variant="outline"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit">Login</Button>
            </form>
          </Box>
        </Container>
      )}
    </>
  );
}
