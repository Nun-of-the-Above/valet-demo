import { useAuth } from "../../context/auth-context";
import { useSessionContext } from "../../context/session-context";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Grid,
  GridItem,
  Container,
} from "@chakra-ui/layout";
import { VotingBox } from "../../components/VotingBox";
import { Pie, PieChart } from "recharts";
import { ResultsBoxUserView } from "../../components/ResultsBoxUserView/ResultsBoxUserView";
import { Button, Image } from "@chakra-ui/react";

export function UserPanel() {
  const { logout } = useAuth();

  const { isLoaded, activeSession, activeRound, currCandidates } =
    useSessionContext();

  // If there is no session, logout the user.
  useEffect(() => {
    if (activeSession && !activeSession.active) {
      logout();
    }
  }, [activeSession]);

  return (
    <div className="relative min-w-full min-h-full">
      {isLoaded ? (
        <Box>
          {activeRound && (
            <>
              {!activeRound && !activeSession.done && (
                <p>No round active right now.</p>
              )}

              {activeRound.roundActive &&
                !activeRound.votingActive &&
                !activeRound.done && (
                  <VStack>
                    <Text>A round is active.</Text>
                    <Text>Wait for the voting to start...</Text>
                  </VStack>
                )}

              {activeRound.votingActive && <VotingBox />}

              {activeRound.done && !activeRound.displayResults && (
                <VStack>
                  <Text>Voting is done.</Text>
                  <Text>Wait for results.</Text>
                </VStack>
              )}

              {activeRound.displayResults && <ResultsBoxUserView />}
            </>
          )}
          {activeSession.done && (
            <VStack>
              <Box
                width="100px"
                minW="110px"
                height="100px"
                border="1px"
                margin="5"
                marginTop="50"
                className="relative rounded-xl"
              >
                <VStack>
                  <Image
                    className="absolute border-4 -top-10"
                    border="1px"
                    boxSize="75px"
                    src={`/${currCandidates}.png`}
                    borderRadius="full"
                    fit="cover"
                    alt={`Bild på ${currCandidates}`}
                  />
                  <Heading size="md" className="pt-10">
                    {currCandidates}
                  </Heading>
                </VStack>
              </Box>
              <Text className="mb-30">
                The session is done! Winner is {currCandidates}!
              </Text>
            </VStack>
          )}

          {!activeRound && !activeSession.done && (
            <VStack>
              <Text>No round active.</Text>
              <Text>Watch the show!</Text>
            </VStack>
          )}
        </Box>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
