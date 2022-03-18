import { Grid, GridItem, Heading, Text, VStack } from "@chakra-ui/layout";
import { useState } from "react";
import { TEST_CANDIDATES } from "../../constants/CANDIDATES_TOOLKIT";
import { useSessionContext } from "../../context/session-context";
import { CandidateVotingButton } from "../CandidateVotingButton/CandidateVotingButton";
import { RoundTimer } from "../RoundTimer/RoundTimer";

export const VotingBox = () => {
  const { activeRound, currCandidates } = useSessionContext();

  const [votingEnabled, setVotingEnabled] = useState(true);

  return (
    <>
      {votingEnabled ? (
        <VStack className="mb-32">
          <RoundTimer round={activeRound} setVotingEnabled={setVotingEnabled} />
          {activeRound.number === 0 ? (
            <>
              <Heading className="px-12 py-2 text-center" size="lg">
                Rösta på det väder du tycker det är idag
              </Heading>
              <Grid
                gridTemplateColumns="1fr 1fr"
                className="gap-4 place-items-center"
              >
                {TEST_CANDIDATES.map((candidate) => (
                  <CandidateVotingButton
                    key={candidate}
                    candidate={candidate}
                  />
                ))}
              </Grid>
            </>
          ) : (
            <>
              <Heading className="px-12 py-2 text-center" size="lg">
                Rösta på den kandidat du vill ska vara kvar
              </Heading>
              <Grid
                gridTemplateColumns="1fr 1fr"
                className="gap-4 place-items-center"
              >
                {currCandidates.map((candidate) => (
                  <CandidateVotingButton
                    key={candidate}
                    candidate={candidate}
                  />
                ))}
              </Grid>
            </>
          )}
        </VStack>
      ) : (
        <VStack>
          <Heading>Tack för din röst!</Heading>
          <Text>Invänta resultatet.</Text>
        </VStack>
      )}
    </>
  );
};
