import { Grid, GridItem, Heading, Text, VStack } from "@chakra-ui/layout";
import { useState } from "react";
import {
  INITIAL_CANDIDATES,
  TEST_CANDIDATES,
} from "../../constants/CANDIDATES_TOOLKIT";
import { useSessionContext } from "../../context/session-context";
import { CandidateVotingButton } from "../CandidateVotingButton/CandidateVotingButton";
import { RoundTimer } from "../RoundTimer/RoundTimer";

export const VotingBox = () => {
  const { activeRound, currCandidates, userVoteInActiveRound } =
    useSessionContext();

  const [votingEnabled, setVotingEnabled] = useState(true);

  return (
    <>
      {votingEnabled ? (
        <VStack className="h-full pb-10 mb-32 place-content-end">
          <div className="flex flex-col h-full place-content-center">
            <RoundTimer
              round={activeRound}
              setVotingEnabled={setVotingEnabled}
              className="px-12 py-6"
            />
          </div>
          {activeRound.number === 0 ? (
            <>
              <Heading className="px-12 py-2 text-center" size="lg">
                {userVoteInActiveRound
                  ? "Tack för din röst!"
                  : "Rösta på det väder du tycker det är idag"}
              </Heading>
              <Grid
                gridTemplateColumns="1fr 1fr"
                className="gap-4 place-items-center"
              >
                {TEST_CANDIDATES.map((candidate) => (
                  <CandidateVotingButton
                    key={candidate}
                    candidate={candidate}
                    stillActive={true}
                  />
                ))}
              </Grid>
            </>
          ) : (
            <>
              <div className="flex flex-col h-full place-content-center">
                <Heading className="px-12 py-6 text-center" size="lg">
                  {userVoteInActiveRound
                    ? "Tack för din röst!"
                    : "Rösta på den kandidat du vill ska vara kvar"}
                </Heading>
              </div>
              <Grid
                gridTemplateColumns="1fr 1fr"
                className="gap-4 place-items-center"
              >
                {INITIAL_CANDIDATES.sort((a, b) => {
                  if (a < b) return 1;
                  if (a > b) return -1;
                  else return 0;
                }).map((candidate) => (
                  <CandidateVotingButton
                    key={candidate}
                    candidate={candidate}
                    stillActive={currCandidates.includes(candidate)}
                  />
                ))}
              </Grid>
            </>
          )}
        </VStack>
      ) : (
        <VStack>
          <Heading>Röstningen är stängd.</Heading>
          <Heading size="md">Invänta resultatet.</Heading>
        </VStack>
      )}
    </>
  );
};
