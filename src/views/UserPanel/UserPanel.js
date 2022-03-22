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
          {activeRound ? (
            <>
              {activeRound.votingActive && <VotingBox />}

              {activeRound.done && !activeRound.displayResults && (
                <div className="flex flex-col gap-4 h-3/4 place-content-center place-items-center animate-pulse">
                  {/* <Heading className="text-center">Tack för din röst!</Heading> */}
                  {/* <Heading size="md" className="text-center"> */}
                  {/* Invänta resultatet. */}
                  {/* </Heading> */}

                  <Spinner size="xl" speed="1s" />
                  <Heading size="md" className="mb-2">
                    Rösterna räknas...
                  </Heading>
                </div>
              )}

              {!activeRound.done && !activeRound.votingActive && (
                <div className="flex flex-col h-3/4 place-content-center">
                  <Heading size="md" className="mt-4 text-center">
                    Ingen röstning aktiv just nu.
                  </Heading>
                </div>
              )}

              {activeRound.displayResults && <ResultsBoxUserView />}
            </>
          ) : (
            <>
              {!activeSession.done && (
                <div className="flex flex-col h-3/4 place-content-center">
                  <Heading size="md" className="mt-4">
                    Ingen röstning aktiv just nu.
                  </Heading>
                </div>
              )}
            </>
          )}

          {activeSession.done && (
            <VStack>
              <Heading>Vinnaren är...</Heading>
              <CandidateCard name={currCandidates} isLoaded={winnerDelay} />
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
