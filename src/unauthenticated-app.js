import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import {
  Box,
  Center,
  Container,
  Heading,
  Text,
  Grid,
  Flex,
  GridItem,
} from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import { useState } from "react";
import { CANDIDATES_TOOLKIT } from "./constants/CANDIDATES_TOOLKIT";
import { useAuth } from "./context/auth-context";
import { useSessionContext } from "./context/session-context";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

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

  const CANDIDATES_NAMES = ["Alina", "Filip", "Simon", "Isabelle"];

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
          <Heading size="md" as="h3" marginTop={5}>
            Välkommen till årets viktigaste val!
          </Heading>
          <Text className="mt-5">
            Här kommer du skriva in ett lösenord när föreställningen börjar.
          </Text>

          <Grid
            gridTemplateColumns="1fr 1fr"
            className="h-full gap-5 mt-10 place-items-center"
          >
            {CANDIDATES_NAMES.map((candidate) => {
              return (
                <GridItem key={candidate}>
                  <CandidatePic candidate={candidate} />
                </GridItem>
              );
            })}
          </Grid>
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

const CandidatePic = ({ candidate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Skeleton height="150px" width="150px" isLoaded={imageLoaded}>
      <Image
        onLoad={() => setImageLoaded(true)}
        borderRadius={"5px"}
        src={`${CANDIDATES_TOOLKIT[candidate].image}`}
        alt={`${candidate}`}
        height="150px"
        width="150px"
        objectFit="cover"
      />
    </Skeleton>
  );
};
