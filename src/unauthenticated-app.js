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

  const [secretWord, setSecretWord] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleRegisterRandom = (e) => {
    e.preventDefault();
    if (secretWord === activeSession.secretWord) {
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
              <Heading size="md">Enter the secret word: </Heading>
              <Input
                type="text"
                value={secretWord}
                onChange={(e) => {
                  setSecretWord(e.target.value);
                  setError(false);
                }}
              />
              <Center>
                <Button type="submit" className="m-2">
                  ENTER
                </Button>
              </Center>
            </form>
            {error ? <p>Wrong secret word. Try again.</p> : <></>}

            <Box className="absolute bottom-0">
              <Heading size="sm">Admin Login</Heading>
              <form onSubmit={(e) => handleLogin(e)}>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Center>
                  <Button type="submit">Login</Button>
                </Center>
              </form>
            </Box>
          </Container>
        ) : (
          <p>The session was retrieved but is not active.</p>
        )
      ) : (
        <Container centerContent maxW="xl">
          <Heading as="h3">Ingen förställning spelas just nu.</Heading>
          <Text>Wait for the admin to active tonight's session.</Text>
          <Box position="fixed" bottom="0" margin="30px">
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
