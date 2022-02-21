import {
  Box,
  Button,
  Heading,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "../../context/auth-context";
import { useSessionContext } from "../../context/session-context";
import { db } from "../../firestore";
import { v4 as uuidv4 } from "uuid";
import { CANDIDATES_TOOLKIT } from "../../constants/CANDIDATES_TOOLKIT";

export const CandidateVotingButton = ({ candidate }) => {
  const { user } = useAuth();
  const { activeRound, userVoteInActiveRound } = useSessionContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [wasClicked, setWasClicked] = useState(false);
  const toast = useToast();

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
      onClick={() => {
        addVote(candidate);
        toast({
          title: "Vote submitted!",
          description: `You have voted for ${candidate} in Round #${activeRound.number}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setWasClicked(() => true);
      }}
      disabled={!activeRound.roundActive || userVoteInActiveRound}
      width="full"
      height="full"
      padding="5"
      border={"2px"}
      borderColor={wasClicked ? CANDIDATES_TOOLKIT[candidate].color : "white"}
    >
      <VStack>
        <SkeletonCircle size="75px" isLoaded={imageLoaded}>
          <Image
            onLoad={() => setImageLoaded(true)}
            boxSize="75px"
            src={`/${candidate}.png`}
            borderRadius="full"
            fit="cover"
            alt={`Bild på ${candidate}`}
          />
        </SkeletonCircle>
        <SkeletonText isLoaded={imageLoaded}>
          <Heading size="md">{candidate}</Heading>
        </SkeletonText>
      </VStack>
    </Button>
  );
};
