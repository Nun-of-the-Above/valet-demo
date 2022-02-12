import { doc, setDoc } from "@firebase/firestore";
import { useAuth } from "../../context/auth-context";
import { useSessionContext } from "../../context/session-context";
import { db } from "../../firestore";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/button";
import {
  Box,
  Center,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/layout";

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
    <>
      {isLoaded ? (
        <Container>
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

              {activeRound.displayResults && <ResultsBox />}

              {activeSession.done && (
                <p>The session is done! Winner is {currCandidates}</p>
              )}
            </>
          )}

          {!activeRound && (
            <VStack>
              <Text>No round active.</Text>
              <Text>Watch the show!</Text>
            </VStack>
          )}

          <Center>
            <Button
              style={{ position: "absolute", bottom: "0px" }}
              onClick={logout}
            >
              Admin log out
            </Button>
          </Center>
        </Container>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

const VotingBox = () => {
  const { activeRound, userVoteInActiveRound, currCandidates } =
    useSessionContext();
  const { user } = useAuth();

  const [seconds, setSeconds] = useState(60);
  const [votingEnabled, setVotingEnabled] = useState(true);

  useEffect(() => {
    let interval = null;
    if (activeRound.votingActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (!activeRound.votingActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeRound]);

  useEffect(() => {
    if (seconds <= 0) {
      setVotingEnabled(false);
    }
  }, [seconds]);

  const addVote = async (candidate) => {
    const voteID = uuidv4();
    await setDoc(doc(db, "votes", voteID), {
      voteID: voteID,
      candidate: candidate,
      userEmail: user.email,
      roundID: activeRound.roundID,
    });
  };

  return (
    <Box>
      {votingEnabled && (
        <>
          <Heading className="text-center">{seconds}</Heading>
          {!userVoteInActiveRound ? (
            <Heading size="sm" className="text-center">
              Please cast your vote in Round # {activeRound.number}
            </Heading>
          ) : (
            <VStack>
              <Text>
                You have voted for {userVoteInActiveRound.candidate} in Round #
                {activeRound.number}
              </Text>
              <Text>Wait for the voting to finish.</Text>
            </VStack>
          )}
          <Grid gridTemplateColumns="1fr 1fr">
            {currCandidates.map((candidate) => {
              return (
                <Button
                  className="m-2"
                  key={uuidv4()}
                  value={candidate}
                  disabled={!activeRound.roundActive || userVoteInActiveRound}
                  onClick={() => addVote(candidate)}
                >
                  {candidate}
                </Button>
              );
            })}
          </Grid>
        </>
      )}
      {!votingEnabled && (
        <VStack>
          <Text>Voting is done.</Text>
          <Text>Wait for results.</Text>
        </VStack>
      )}
    </Box>
  );
};

const ResultsBox = () => {
  const { activeRound, voteCountInPercentage } = useSessionContext();

  return (
    <>
      {activeRound && activeRound.displayResults && (
        <>
          <Heading size="md" className="text-center">
            RESULTS
          </Heading>
          {Object.entries(voteCountInPercentage)
            .sort((a, b) => b[1] - a[1])
            .map(([candidate, voteCount]) => (
              <Text key={uuidv4()} className="text-center">
                {candidate}: {voteCount}%
              </Text>
            ))}
        </>
      )}
    </>
  );
};
