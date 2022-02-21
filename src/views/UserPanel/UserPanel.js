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
                <p>Ingen runda aktiv just nu.</p>
              )}

              {activeRound.roundActive &&
                !activeRound.votingActive &&
                !activeRound.done && (
                  <VStack>
                    <Heading>En runda är aktiv.</Heading>
                    <Text>Vänta på att röstningen startar...</Text>
                  </VStack>
                )}

              {activeRound.votingActive && <VotingBox />}

              {activeRound.done && !activeRound.displayResults && (
                <VStack>
                  <Heading>Röstningen är klar.</Heading>
                  <Text>Vänta på resultatet...</Text>
                </VStack>
              )}

              {activeRound.displayResults && <ResultsBoxUserView />}
            </>
          )}
          {activeSession.done && (
            <VStack>
              <Heading>Vinnaren är...</Heading>
              <CandidateCard name={currCandidates} isLoaded={winnerDelay} />
            </VStack>
          )}

          {!activeRound && !activeSession.done && (
            <VStack>
              <Heading size="md">Ingen röstning aktiv just nu.</Heading>
              <Text>Titta på föreställningen.</Text>
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
