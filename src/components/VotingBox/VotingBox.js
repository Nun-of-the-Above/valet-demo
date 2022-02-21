import { Grid, GridItem, Heading, Text, VStack } from "@chakra-ui/layout";
import { toast, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useSessionContext } from "../../context/session-context";
import { CandidateVotingButton } from "../CandidateVotingButton/CandidateVotingButton";
import { RoundTimer } from "../RoundTimer/RoundTimer";

export const VotingBox = () => {
  const { activeRound, userVoteInActiveRound, currCandidates } =
    useSessionContext();

  const [votingEnabled, setVotingEnabled] = useState(true);

  return (
    <>
      {votingEnabled ? (
        <Grid className="h-full" gridTemplateRows={"1fr 2fr"}>
          <RoundTimer round={activeRound} setVotingEnabled={setVotingEnabled} />
          <Grid
            gridTemplateColumns="1fr 1fr"
            className="relative h-full mx-10 mt-10 place-items-center"
          >
            {currCandidates.map((candidate) => {
              return (
                <GridItem key={candidate}>
                  <CandidateVotingButton candidate={candidate} />
                </GridItem>
              );
            })}
          </Grid>
        </Grid>
      ) : (
        <VStack>
          <Heading>Voting is done.</Heading>
          <Text>Wait for results.</Text>
        </VStack>
      )}
    </>
  );
};
