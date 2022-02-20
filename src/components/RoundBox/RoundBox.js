import { Button } from "@chakra-ui/button";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/layout";
import { collection, doc, updateDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useAdminContext } from "../../context/admin-context";
import { db } from "../../firestore";
import { RoundTimer } from "../RoundTimer/RoundTimer";
import { TempAdminFastVoting } from "../TempAdminFastVoting";
import { resetRound } from "../../helpers/resetRound";
import { correctIfDuplicateLosers } from "../../helpers/correctIfDuplicateLosers";
import { updateCurrentCandidates } from "../../helpers/updateCurrentCandidates";

export function RoundBox({ round, disabled }) {
  const roundRef = doc(collection(db, "rounds"), round.roundID);
  const [voteCount, setVoteCount] = useState(null);
  const [session, setSession] = useState(null);
  const [votesInActiveRound, setVotesInActiveRound] = useState(null);
  const { sessions, rounds, votes } = useAdminContext();

  useEffect(() => {
    if (!votes) return;
    const votesInActiveRound = votes.filter((v) => v.roundID === round.roundID);
    setVotesInActiveRound(votesInActiveRound);

    const voteMap = new Map();

    round.candidatesInRound.forEach((candidate) => voteMap.set(candidate, 0));

    votesInActiveRound.forEach((vote) => {
      voteMap.set(vote.candidate, Number(voteMap.get(vote.candidate) + 1));
    });

    setVoteCount([...voteMap]);
  }, [votes, round]);

  // Filter out sessions from hook to get session for this round.
  useEffect(() => {
    const parentSession = sessions.find(
      (s) => s.sessionID === round.parentSessionID
    );

    setSession(parentSession);
  }, [sessions, round]);

  return (
    <Box
      border={`4px solid ${round.roundActive ? "red" : "black"}`}
      padding="5"
      className="self-start"
    >
      <VStack>
        <Heading size="md">ROUND #{round.number}</Heading>
        {round.done && !round.roundActive && <p>ROUND COMPLETED</p>}
        <HStack>
          <Button
            disabled={round.roundActive || round.done || disabled}
            onClick={() => {
              updateDoc(roundRef, { roundActive: true });
            }}
          >
            OPEN ROUND
          </Button>
          <Button
            disabled={!round.roundActive || !round.done}
            onClick={() => {
              updateDoc(roundRef, { roundActive: false });
              updateCurrentCandidates(round, voteCount, rounds);
            }}
          >
            CLOSE ROUND
          </Button>
        </HStack>

        {round.roundActive && (
          <>
            <HStack padding="3">
              <Button
                disabled={round.votingActive || round.done || disabled}
                onClick={() => {
                  updateDoc(roundRef, { votingActive: true });
                }}
              >
                START VOTING
              </Button>

              <Button
                disabled={!round.votingActive}
                onClick={() => {
                  updateDoc(roundRef, { votingActive: false, done: true });
                  correctIfDuplicateLosers(
                    round,
                    voteCount,
                    session.candidatesLeft,
                    votesInActiveRound
                  );
                }}
              >
                STOP VOTING
              </Button>
            </HStack>

            <RoundTimer round={round} />

            <HStack padding="3">
              <Button
                disabled={round.displayResults || !round.done}
                onClick={() => {
                  updateDoc(roundRef, { displayResults: true });
                }}
              >
                SHOW RESULTS
              </Button>

              <Button
                disabled={!round.displayResults}
                onClick={() => {
                  updateDoc(roundRef, { displayResults: false });
                }}
              >
                HIDE RESULTS
              </Button>
            </HStack>
          </>
        )}

        {voteCount && <ResultsBoxAdmin voteCount={voteCount} />}
        <Button
          width="full"
          colorScheme="red"
          disabled={round.roundActive || !round.done}
          onClick={() => {
            resetRound(round, voteCount, votesInActiveRound);
          }}
        >
          RESET ROUND
        </Button>

        {/** TEMPORARY FAST VOTING */}
        {round.votingActive && <TempAdminFastVoting round={round} />}
      </VStack>
    </Box>
  );
}

const ResultsBoxAdmin = ({ voteCount }) => {
  return (
    <>
      <Heading className="text-center" size="md">
        RESULTS
      </Heading>
      <Grid
        templateColumns="1fr 1fr"
        border="4px"
        padding="3"
        width="full"
        className="place-content-evenly"
      >
        {voteCount
          .sort((a, b) => a[0] - b[0])
          .map(([candidate, numOfVotes]) => (
            <GridItem key={candidate}>
              {candidate}: {numOfVotes}
            </GridItem>
          ))}
      </Grid>
    </>
  );
};
