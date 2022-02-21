import { useAuth } from "../../context/auth-context";
import { useSessionContext } from "../../context/session-context";
import { useEffect, useState } from "react";
import { Heading, Text, VStack, Center, Container } from "@chakra-ui/layout";
import { VotingBox } from "../../components/VotingBox";
import { ResultsBoxUserView } from "../../components/ResultsBoxUserView/ResultsBoxUserView";
import { Spinner } from "@chakra-ui/react";
import { CandidateCard } from "../../components/CandidateCard";

export function UserPanel() {
  const { logout } = useAuth();

  const { isLoaded, activeSession, activeRound, currCandidates } =
    useSessionContext();
  const [winnerDelay, setWinnerDelay] = useState(false);

  // If there is no session, logout the user.
  useEffect(() => {
    if (activeSession && !activeSession.active) {
      logout();
    }
  }, [activeSession]);

  useEffect(() => {
    if (activeSession && activeSession.done) {
      setTimeout(() => {
        setWinnerDelay(true);
      }, 2000);
    }
  }, [activeSession]);

  return (
    <>
      {isLoaded ? (
        <>
          {activeRound && (
            <>
              {!activeRound && !activeSession.done && (
                <p>No round active right now.</p>
              )}

              {activeRound.roundActive &&
                !activeRound.votingActive &&
                !activeRound.done && (
                  <VStack>
                    <Heading>A round is active.</Heading>
                    <Text>Wait for the voting to start...</Text>
                  </VStack>
                )}

              {activeRound.votingActive && <VotingBox />}

              {activeRound.done && !activeRound.displayResults && (
                <VStack>
                  <Heading>Voting is done.</Heading>
                  <Text>Wait for results.</Text>
                </VStack>
              )}

              {activeRound.displayResults && <ResultsBoxUserView />}
            </>
          )}
          {activeSession.done && (
            <VStack>
              <Heading>The winner is...</Heading>
              <CandidateCard name={currCandidates} isLoaded={winnerDelay} />
            </VStack>
          )}

          {!activeRound && !activeSession.done && (
            <VStack>
              <Heading>No round active</Heading>
              <Text>Watch the show!</Text>
            </VStack>
          )}
        </>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </>
  );
}
