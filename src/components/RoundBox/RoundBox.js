import { Button } from "@chakra-ui/button";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/layout";
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  writeBatch,
  deleteDoc,
  where,
  query,
  getDocs,
} from "@firebase/firestore";
import { httpsCallable } from "@firebase/functions";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSessionContext } from "../../context/session-context";
import { db, functions } from "../../firestore";

export function RoundBox({ round }) {
  const { rounds, activeSession, currCandidates, votesInActiveRound } =
    useSessionContext();

  const roundRef = doc(collection(db, "rounds"), round.roundID);

  const resetRound = httpsCallable(functions, "resetRound");

  const addVote = async (candidate) => {
    const voteID = uuidv4();
    const randomUserEmail = `${uuidv4()}@gmail.com`;
    await setDoc(doc(db, "votes", voteID), {
      voteID: voteID,
      candidate: candidate,
      userEmail: randomUserEmail,
      roundID: round.roundID,
    });
  };

  const deleteVoteForCandidate = async (candidate) => {
    const voteToDelete = votesInActiveRound.find(
      (vote) => vote.candidate === candidate
    );
    try {
      await deleteDoc(doc(db, "votes", voteToDelete.voteID));
      console.log("Successfully deleted vote for", candidate);
    } catch {
      console.error("Failed to delete vote for", candidate);
    }
  };

  //TODO: CLEAN UP THIS FUNCTION
  function updateCurrentCandidates(currentRound) {
    const sessionRef = doc(db, "sessions", round.parentSessionID);
    const loserName = Object.entries(currentRound.voteCount).sort(
      (a, b) => a[1] - b[1]
    )[0][0];

    console.log("Loser: ", loserName);
    console.log("CandidatesLeft: ", activeSession.candidatesLeft);

    const newCandidatesLeft = activeSession.candidatesLeft.filter(
      (c) => c !== loserName
    );
    console.log("newCandidatesLeft: ", newCandidatesLeft);

    updateDoc(sessionRef, {
      candidatesLeft: newCandidatesLeft,
    })
      .then((data) => {
        console.log("Successfully updated session candidate list: ", data);
      })
      .catch((e) =>
        console.error("Error updating session candidate list: ", e)
      );

    const remainingRounds = rounds.filter((round) => !round.done);

    remainingRounds.forEach((otherRound) => {
      const voteCount = otherRound.voteCount;
      const loserName = Object.entries(currentRound.voteCount).sort(
        (a, b) => a[1] - b[1]
      )[0][0];
      const otherRoundRef = doc(db, "rounds", otherRound.roundID);

      const voteCountWithoutLoser = Object.entries(voteCount).filter(
        ([name]) => name !== loserName
      );

      const newVoteCount = Object.fromEntries(voteCountWithoutLoser);

      updateDoc(otherRoundRef, {
        voteCount: newVoteCount,
      })
        .then(() => console.log("Successful changed round votecount."))
        .catch((e) => {
          console.error("Error updating round votecount: " + e);
        });
    });
  }

  //If duplicate losers in round.voteCount we correct to get only one loser.
  const correctIfDuplicateLosers = async (voteCount) => {
    const sorted = Object.entries(voteCount).sort((a, b) => a[1] - b[1]);
    const losers = sorted.filter(([c, votes]) => votes === sorted[0][1]);
    const loserVoteCount = losers[0][1];
    const randomIndexOfLosers = Math.floor(Math.random() * losers.length);
    const nameOfRandomLoser = losers[randomIndexOfLosers][0];

    //Case 1: Single loser. Just return.
    if (losers.length === 1) return;

    //Case 2: Multiple losers and are >0.
    //Choose loser at random from losers, delete a vote that has that candidate.
    if (loserVoteCount > 0) {
      await deleteVoteForCandidate(nameOfRandomLoser);
    }

    //Case 3: Multiple losers and are =0.
    if (loserVoteCount === 0) {
      const batch = writeBatch(db);
      try {
        //Add vote to all candidates.
        currCandidates.forEach((candidate) => {
          const voteID = uuidv4();
          const randomUserEmail = `${uuidv4()}@gmail.com`;
          batch.set(doc(db, "votes", voteID), {
            voteID: voteID,
            candidate: candidate,
            userEmail: randomUserEmail,
            roundID: round.roundID,
          });
        });

        await batch.commit();
        console.log("Added 1 vote to all.");

        const votesRef = collection(db, "votes");
        const q = query(votesRef, where("roundID", "==", round.roundID));

        const querySnapshot = await getDocs(q);
        let votesInRound = [];
        querySnapshot.forEach((doc) => votesInRound.push(doc.data()));

        //Choose loser at random from losers, delete one vote that has that candidate.
        const voteToDelete = votesInRound.find(
          (vote) => vote.candidate === nameOfRandomLoser
        );

        deleteDoc(doc(db, "votes", voteToDelete.voteID));
        console.log("Deleted 1 vote for", nameOfRandomLoser);
      } catch (e) {
        console.error("Failed to add one to all and then delete random vote.");
      }
    }
  };

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
            disabled={round.roundActive || round.done}
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
              updateCurrentCandidates(round);
            }}
          >
            CLOSE ROUND
          </Button>
        </HStack>

        {round.roundActive && (
          <>
            <HStack padding="3">
              <Button
                disabled={round.votingActive || round.done}
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
                  correctIfDuplicateLosers(round.voteCount);
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

        <Heading className="text-center" size="md">
          RESULTS
        </Heading>
        <Grid templateColumns="1fr 1fr">
          {Object.entries(round.voteCount)
            .sort((a, b) => b[0] - a[0])
            .map(([candidate, voteCount]) => (
              <GridItem key={uuidv4()} className="justify-self-center">
                {candidate}: {voteCount}
              </GridItem>
            ))}
        </Grid>
        <Button
          width="full"
          colorScheme="red"
          disabled={activeSession.done || !round.done}
          onClick={() => {
            resetRound(round);
          }}
        >
          RESET ROUND
        </Button>
        {round.votingActive && (
          <Grid templateColumns="1fr 1fr">
            {Object.entries(round.voteCount)
              .sort((a, b) => b[0] - a[0])
              .map(([candidate, voteCount]) => (
                <Button
                  key={candidate}
                  className="m-1 justify-self-center"
                  onClick={() => addVote(candidate)}
                >
                  Vote for {candidate}
                </Button>
              ))}
          </Grid>
        )}
      </VStack>
    </Box>
  );
}

//Will be with user as well
const RoundTimer = ({ round }) => {
  const [seconds, setSeconds] = useState(60);
  const [intervalState, setIntervalState] = useState(null);
  localStorage.setItem("key", "value");

  useEffect(() => {
    if (!round.votingActive) return;
    console.log(localStorage.getItem(round.roundID));
    if (localStorage.getItem(round.roundID)) {
      if (intervalState === null) {
        const startTime = new Date(localStorage.getItem(round.roundID));
        const currentTime = new Date();

        const diff = Math.ceil((currentTime - startTime) / 1000);

        setSeconds(60 - diff);
      }
    } else {
      localStorage.setItem(round.roundID, new Date());
    }
  }, [round]);

  useEffect(() => {
    console.log(round);
    if (round.votingActive && intervalState === null) {
      setIntervalState(
        setInterval(() => {
          setSeconds((seconds) => seconds - 1);
        }, 1000)
      );
    } else if (!round.votingActive) {
      clearInterval(intervalState);
    }
    // return () => {
    // console.log("Clean up happened.");
    // clearInterval(intervalState);
    // };
  }, [round]);

  return (
    <div>
      {round.done ? <p>Voting is done.</p> : <p>Vote countdown: {seconds}</p>}
    </div>
  );
};
