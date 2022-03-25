import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import {
  Box,
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/layout";
import { Image, Skeleton, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { CANDIDATES_TOOLKIT } from "./constants/CANDIDATES_TOOLKIT";
import { useAuth } from "./context/auth-context";
import { useSessionContext } from "./context/session-context";

export function UnauthenticatedApp() {
  const { login, registerWithRandomEmail } = useAuth();
  const { activeSession, isLoaded } = useSessionContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminShow, setAdminShow] = useState(false);

  const toast = useToast();

  const [secretWord, setSecretWord] = useState("");
  const [error, setError] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleRegisterRandom = (e) => {
    e.preventDefault();
    if (secretWord.toLowerCase() === activeSession.secretWord) {
      toast({
        title: "Hurra! Du är nu inloggad!",
        description: `Lyssna på teknikern för fler instruktioner.`,
        status: "success",
        duration: 20000,
        isClosable: false,
        position: "top",
      });
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
              <Heading size="md" className="my-5 text-center">
                LÖSENORD
              </Heading>
              <Text fontSize={"lg"} className="mt-5 text-center">
                Lösenordet ropas ut av en tekniker i foajén.
              </Text>
              <Text fontSize={"lg"} className="mb-10 text-center">
                Både stora och små bokstäver funkar.
              </Text>

              <Input
                rounded={"md"}
                size="lg"
                border="2px"
                borderColor={"green.400"}
                placeholder="Skriv lösenordet här..."
                type="text"
                className="mb-2"
                value={secretWord}
                onChange={(e) => {
                  setSecretWord(e.target.value);
                  setError(false);
                }}
              />

              {error && (
                <Heading size="sm" marginTop="3">
                  Fel lösenord. Försök igen.
                </Heading>
              )}
              <Center>
                <Button
                  width={"full"}
                  size="lg"
                  className="mt-2"
                  type="submit"
                  colorScheme={"green"}
                >
                  LOGGA IN
                </Button>
              </Center>
            </form>
          </Container>
        ) : (
          <p>Föreställningen hämtades men är inte igång.</p>
        )
      ) : (
        <Container className="text-center">
          <Heading size="md" as="h3" className="my-5">
            Välkommen till årets viktigaste val
          </Heading>

          <Text fontSize="2xl" className="my-6 leading-snug">
            På den här hemsidan kommer du att rösta tre gånger under
            föreställningens gång.
          </Text>

          <Text fontSize="2xl" className="my-6 leading-snug">
            En tekniker kommer att leda dig igenom en test-röstning i foajén
            innan föreställningen börjar.
          </Text>

          <Grid
            gridTemplateColumns="1fr 1fr"
            gridTemplateRows="1fr 1fr"
            className="gap-5 mt-10 place-items-center"
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
      <div className="invisible lg:visible">
        <Button
          backgroundColor={"white"}
          position="fixed"
          bottom="0"
          margin="30px"
          onClick={() => setAdminShow(!adminShow)}
        >
          Admin
        </Button>
      </div>
      {adminShow && (
        <Box
          className="p-2 bg-white border-2 rounded-md"
          position="fixed"
          bottom="50"
          margin="30px"
        >
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
        borderRadius={"lg"}
        src={`${CANDIDATES_TOOLKIT[candidate].image}`}
        alt={`${candidate}`}
        height="150px"
        width="150px"
        objectFit="cover"
      />
    </Skeleton>
  );
};
