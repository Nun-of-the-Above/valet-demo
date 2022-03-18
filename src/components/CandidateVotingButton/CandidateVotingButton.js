import {
  Button,
  Heading,
  Image,
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
          title: "Tack för din röst!",
          description: `Din röst på ${candidate} har registrerats.`,
          status: "success",
          duration: 8000,
          isClosable: false,
        });
        setWasClicked(() => true);
      }}
      bgColor={CANDIDATES_TOOLKIT[candidate].color}
      color={"white"}
      rounded={"lg"}
      disabled={!activeRound.roundActive || userVoteInActiveRound}
      width="140px"
      height="180px"
      padding="5"
      border={"2px"}
      borderColor={wasClicked ? "green" : "white"}
      backdropBlur={10}
    >
      <VStack>
        <SkeletonCircle size="100px" className="mb-2" isLoaded={imageLoaded}>
          <Image
            onLoad={() => setImageLoaded(true)}
            boxSize="100px"
            src={`${CANDIDATES_TOOLKIT[candidate].image}`}
            borderRadius="full"
            fit="cover"
            alt={`Bild på ${candidate}`}
          />
        </SkeletonCircle>
        <SkeletonText isLoaded={imageLoaded} noOfLines={1}>
          <Heading size="lg">{candidate}</Heading>
        </SkeletonText>
      </VStack>
    </Button>
  );
};
