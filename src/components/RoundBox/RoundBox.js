import { Button } from "@chakra-ui/button";
import { Box, Heading, VStack, Text } from "@chakra-ui/layout";
import { collection, doc, updateDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { TEST_CANDIDATES } from "../../constants/CANDIDATES_TOOLKIT";
import { useAdminContext } from "../../context/admin-context";
import { db } from "../../firestore";
import { correctIfDuplicateLosers } from "../../helpers/correctIfDuplicateLosers";
import { updateCurrentCandidates } from "../../helpers/updateCurrentCandidates";
import { RoundTimer } from "../RoundTimer/RoundTimer";
import { getDatabase, ref, set } from "firebase/database";
import { ResultsBoxAdmin } from "./../ResultsBoxAdmin";

export function RoundBox({ round, disabled }) {
  const roundRef = doc(collection(db, "rounds"), round.roundID);
  const [voteCount, setVoteCount] = useState(null);
  const [votesInActiveRound, setVotesInActiveRound] = useState(null);
  const { votes } = useAdminContext();

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

  return (
    <Box
      className="p-5 m-3 rounded-3xl"
      opacity={round.done && !round.roundActive ? "0.5" : "1"}
      bgColor={"white"}
      border={`1px solid ${round.roundActive ? "red" : "black"}`}
    >
      <VStack>
        <Heading size="md">ROUND #{round.number}</Heading>
        {round.done && !round.roundActive && <p>RUNDA KLAR</p>}

        {!round.roundActive && (
          <OpenRoundButton
            round={round}
            roundRef={roundRef}
            disabled={disabled}
          />
        )}

        {round.roundActive && (
          <>
            <StartVotingButton
              round={round}
              roundRef={roundRef}
              disabled={disabled}
            />

            <RoundTimer round={round} isAdmin={true} />

            <CloseVotingButton
              round={round}
              roundRef={roundRef}
              disabled={disabled}
              votesInActiveRound={votesInActiveRound}
              voteCount={voteCount}
            />

            <ShowResultsButton round={round} roundRef={roundRef} />

            <CloseRoundButton
              round={round}
              roundRef={roundRef}
              voteCount={voteCount}
              disabled={disabled}
            />
          </>
        )}

        {voteCount && (round.done || round.roundActive) && (
          <ResultsBoxAdmin voteCount={voteCount} round={round} />
        )}

        {/* TODO: Add this when resetRound function is done. */}
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
      </VStack>
    </Box>
  );
}

// TODO: All these buttons can be generalized to one component taking params.
const OpenRoundButton = ({ round, roundRef, disabled }) => (
  <Button
    width="full"
    colorScheme="green"
    disabled={round.roundActive || round.done || disabled}
    onClick={() => updateDoc(roundRef, { roundActive: true })}
  >
    ÖPPNA RUNDA
  </Button>
);

const StartVotingButton = ({ round, roundRef, disabled }) => (
  <Button
    colorScheme="green"
    w="full"
    disabled={round.votingActive || round.done || disabled}
    onClick={() => {
      updateDoc(roundRef, { votingActive: true });
    }}
  >
    STARTA RÖSTNING
  </Button>
);

const ShowResultsButton = ({ round, roundRef }) => (
  <Button
    colorScheme="green"
    width={"full"}
    disabled={round.displayResults || !round.done}
    onClick={() => {
      updateDoc(roundRef, { displayResults: true });
    }}
  >
    VISA RESULTAT
  </Button>
);

const CloseVotingButton = ({
  round,
  votesInActiveRound,
  voteCount,
  roundRef,
}) => {
  const [session, setSession] = useState(null);
  const { sessions } = useAdminContext();
  const realTimeDatabase = getDatabase();

  // Filter out sessions from hook to get session for this round.
  useEffect(() => {
    const parentSession = sessions.find(
      (s) => s.sessionID === round.parentSessionID
    );

    setSession(parentSession);
  }, [sessions, round]);

  // Write to the countdown timer on realTimeDatabase
  function writeTimeToDb(seconds) {
    set(ref(realTimeDatabase, "timer/"), {
      value: seconds,
    });
  }

  return (
    <Button
      colorScheme="red"
      width="full"
      disabled={!round.votingActive}
      onClick={() => {
        updateDoc(roundRef, { votingActive: false, done: true });
        writeTimeToDb(60);
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
  );
};

const CloseRoundButton = ({ round, roundRef, voteCount, disabled }) => {
  const { rounds } = useAdminContext();

  return (
    <Button
      width="full"
      colorScheme={"red"}
      disabled={
        !round.roundActive || !round.done || disabled || !round.displayResults
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
  );
};
