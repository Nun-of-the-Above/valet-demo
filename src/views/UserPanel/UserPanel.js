import { Heading, VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CandidateCard } from "../../components/CandidateCard";
import { ResultsBoxUserView } from "../../components/ResultsBoxUserView/ResultsBoxUserView";
import { VotingBox } from "../../components/VotingBox";
import { useAuth } from "../../context/auth-context";
import { useSessionContext } from "../../context/session-context";

export function UserPanel() {
  const { logout } = useAuth();

  const { isLoaded, activeSession, allSessions, activeRound, currCandidates } =
    useSessionContext();
  const [winnerDelay, setWinnerDelay] = useState(false);

  // If there is no session active, logout the user.
  useEffect(() => {
    if (allSessions && allSessions.every((s) => s.active === false)) {
      console.log(
        "User has old login-cookie. No session is active -> Cookie deleted."
      );
      logout();
    }
  }, [allSessions, logout]);

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
                <div className="flex flex-col gap-4 mt-10 place-content-center place-items-center animate-pulse">
                  <Spinner size="xl" speed="1s" />
                  <Heading size="md" className="mb-2">
                    Rösterna räknas...
                  </Heading>
                </div>
              )}

              {!activeRound.done && !activeRound.votingActive && (
                <div className="flex flex-col mt-5 place-content-center">
                  <Heading size="md" className="mt-4 text-center">
                    Ingen röstning pågår just nu.
                  </Heading>
                </div>
              )}

              {activeRound.displayResults && <ResultsBoxUserView />}
            </>
          ) : (
            <>
              {!activeSession.done && (
                <div className="flex flex-col w-full mt-5 place-content-center">
                  <Heading size="md" className="mt-4 text-center">
                    Ingen röstning pågår just nu.
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
        <VStack className="mt-10">
          <Spinner />
        </VStack>
      )}
    </>
  );
}
