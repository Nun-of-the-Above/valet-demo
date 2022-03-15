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
        <Grid className="mb-32" gridTemplateRows={"1fr 3fr"}>
          <RoundTimer round={activeRound} setVotingEnabled={setVotingEnabled} />
          {activeRound.number === 0 ? (
            <Grid
              gridTemplateColumns="1fr 1fr"
              className="h-full mx-5 my-10 place-items-center"
            >
              {TEST_CANDIDATES.map((candidate) => {
                return (
                  <GridItem key={candidate}>
                    <CandidateVotingButton candidate={candidate} />
                  </GridItem>
                );
              })}
            </Grid>
          ) : (
            <>
              <Grid
                gridTemplateColumns="1fr 1fr"
                className="gap-4 mx-5 my-10 place-items-center"
              >
                {currCandidates.map((candidate) => {
                  return (
                    <GridItem key={candidate}>
                      <CandidateVotingButton candidate={candidate} />
                    </GridItem>
                  );
                })}
              </Grid>
            </>
          )}
        </Grid>
      ) : (
        <VStack>
          <Heading>Tack för din röst!</Heading>
          <Text>Invänta resultatet.</Text>
        </VStack>
      )}
    </>
  );
};
