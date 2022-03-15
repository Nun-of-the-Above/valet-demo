import { Button } from "@chakra-ui/button";
import { Box, Grid, GridItem, Heading, VStack, Text } from "@chakra-ui/layout";
import { collection, doc, updateDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useAdminContext } from "../../context/admin-context";
import { db } from "../../firestore";
import { RoundTimer } from "../RoundTimer/RoundTimer";
import { correctIfDuplicateLosers } from "../../helpers/correctIfDuplicateLosers";
import { updateCurrentCandidates } from "../../helpers/updateCurrentCandidates";
import { TEST_CANDIDATES } from "../../constants/CANDIDATES_TOOLKIT";
import { TempAdminFastVoting } from "../../components/TempAdminFastVoting";

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
      className="self-start p-5 rounded-3xl"
      border={`1px solid ${round.roundActive ? "red" : "black"}`}
    >
      <VStack>
        <Heading size="md">ROUND #{round.number}</Heading>
        {round.done && !round.roundActive && <p>RUNDA KLAR</p>}

        {!round.roundActive && (
          <Button
            width="full"
            colorScheme="green"
            disabled={round.roundActive || round.done || disabled}
            onClick={() => {
              updateDoc(roundRef, { roundActive: true });
            }}
          >
            ÖPPNA RUNDA
          </Button>
        )}

        {round.roundActive && (
          <>
            <Button
              colorScheme="green"
              width="full"
              disabled={round.votingActive || round.done || disabled}
              onClick={() => {
                updateDoc(roundRef, { votingActive: true });
              }}
            >
              STARTA RÖSTNING
            </Button>

            <RoundTimer round={round} />

            <Button
              colorScheme="red"
              width="full"
              disabled={!round.votingActive}
              onClick={() => {
                updateDoc(roundRef, { votingActive: false, done: true });
                if (round.number === 0) {
                  correctIfDuplicateLosers(
                    round,
                    voteCount,
                    TEST_CANDIDATES,
                    votesInActiveRound
                  );
                } else {
                  correctIfDuplicateLosers(
                    round,
                    voteCount,
                    session.candidatesLeft,
                    votesInActiveRound
                  );
                }
              }}
            >
              AVSLUTA RÖSTNING
            </Button>

            <Button
              colorScheme="green"
              disabled={round.displayResults || !round.done}
              onClick={() => {
                updateDoc(roundRef, { displayResults: true });
              }}
            >
              VISA RESULTAT FÖR PUBLIKEN
            </Button>
            <Button
              width="full"
              colorScheme={"red"}
              disabled={
                !round.roundActive ||
                !round.done ||
                disabled ||
                !round.displayResults
              }
              onClick={() => {
                updateDoc(roundRef, { roundActive: false });
                if (round.number === 0) {
                } else {
                  updateCurrentCandidates(round, voteCount, rounds);
                }
              }}
            >
              STÄNG RUNDA
            </Button>
          </>
        )}

        {voteCount && <ResultsBoxAdmin voteCount={voteCount} />}
        {/* <Button
          width="full"
          colorScheme="red"
          disabled={round.roundActive || !round.done}
          onClick={() => {
            resetRound(round, voteCount, votesInActiveRound);
          }}
        >
          NOLLSTÄLL RUNDA
        </Button> */}

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
        RESULTAT
      </Heading>
      <Grid
        templateColumns="1fr 1fr"
        border="1px"
        padding="3"
        width="full"
        className="rounded-lg place-content-evenly"
      >
        {voteCount
          .sort((a, b) => a[0] - b[0])
          .map(([candidate, numOfVotes]) => (
            <GridItem key={candidate}>
              <Text className="m-1 whitespace-nowrap">
                {candidate}: {numOfVotes}
              </Text>
            </GridItem>
          ))}
      </Grid>
    </>
  );
};
