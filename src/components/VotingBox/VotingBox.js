import { Button } from "@chakra-ui/button";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { useSessionContext } from "../../context/session-context";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "@firebase/firestore";
import { db } from "../../firestore";
import { Image } from "@chakra-ui/image";

export const VotingBox = () => {
  const { activeRound, userVoteInActiveRound, currCandidates } =
    useSessionContext();

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

  return (
    <div className="h-full min-h-full">
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
          <Grid
            gridTemplateColumns="1fr 1fr"
            className="relative bottom-0 mt-10 place-items-center"
          >
            {currCandidates.map((candidate) => {
              return (
                <GridItem key={candidate}>
                  <CandidateButton candidate={candidate}>
                    {candidate}
                  </CandidateButton>
                </GridItem>
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
    </div>
  );
};

const CandidateButton = ({ candidate }) => {
  const { user } = useAuth();
  const { activeRound, userVoteInActiveRound } = useSessionContext();

  // ? Should this have error-handling?
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
    <Button
      onClick={() => addVote(candidate)}
      width="100px"
      minW="110px"
      height="100px"
      border="1px"
      margin="5"
      marginTop="10"
      className="place-self-center"
      disabled={!activeRound.roundActive || userVoteInActiveRound}
    >
      <VStack>
        <Image
          className="absolute border-4 -top-10"
          border="1px"
          boxSize="75px"
          src={`/${candidate}.png`}
          borderRadius="full"
          fit="cover"
          alt={`Bild på ${candidate}`}
        />
        <Heading size="md" className="pt-5">
          {candidate}
        </Heading>
      </VStack>
    </Button>
  );
};
