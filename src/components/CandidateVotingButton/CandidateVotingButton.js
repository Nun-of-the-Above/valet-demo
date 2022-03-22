import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "../../context/auth-context";
import { useSessionContext } from "../../context/session-context";
import { db } from "../../firestore";
import { v4 as uuidv4 } from "uuid";
import { CANDIDATES_TOOLKIT } from "../../constants/CANDIDATES_TOOLKIT";

export const CandidateVotingButton = ({ candidate, stillActive }) => {
  const { user } = useAuth();
  const { activeRound, userVoteInActiveRound } = useSessionContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
    <>
      <Box
        onClick={
          userVoteInActiveRound || !stillActive
            ? null
            : () => {
                onOpen();
              }
        }
        bgColor={
          stillActive
            ? CANDIDATES_TOOLKIT[candidate].color
            : "rgba(0, 0, 0, .30)"
        }
        color={"white"}
        rounded={"lg"}
        disabled={userVoteInActiveRound || !stillActive}
        width="140px"
        height="180px"
        padding="5"
        border={"2px"}
        borderColor={isOpen ? "green" : "white"}
        className="flex flex-col "
        opacity={
          userVoteInActiveRound
            ? userVoteInActiveRound.candidate === candidate
              ? 1
              : 0.5
            : stillActive
            ? 1
            : 0.5
        }
      >
        <SkeletonCircle size="100px" className="mb-2 " isLoaded={imageLoaded}>
          <Image
            onLoad={() => setImageLoaded(true)}
            boxSize="100px"
            src={`${CANDIDATES_TOOLKIT[candidate].image}`}
            borderRadius="full"
            fit="cover"
            alt={`Bild på ${candidate}`}
          />
        </SkeletonCircle>
        <SkeletonText isLoaded={imageLoaded} noOfLines={1} paddingBottom={3}>
          <Heading className="text-center" size="lg">
            {candidate}
          </Heading>
        </SkeletonText>
        {!stillActive && (
          <Skeleton className="absolute" isLoaded={imageLoaded}>
            <Center className="absolute w-[140px] h-[180px] -mt-[22px] -ml-[22px] z-50">
              <div className="absolute origin-center w-[200px] rotate-[52deg] border-4 border-red-700 border-solid" />
              <div className="absolute origin-center w-[200px] -rotate-[52deg] border-4 border-red-700 border-solid" />
            </Center>
          </Skeleton>
        )}
      </Box>

      <Drawer
        placement={"bottom"}
        onClose={onClose}
        isOpen={isOpen}
        autoFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader className="text-center">
            <Center marginTop={"-24"} marginBottom={"5"}>
              <Image
                boxSize="150px"
                src={`${CANDIDATES_TOOLKIT[candidate].image}`}
                borderRadius="full"
                fit="cover"
                alt={`Bild på ${candidate}`}
                className="border-4 border-solid"
                borderColor={"white"}
              />
            </Center>
            <Heading size="md">Du kommer att rösta på {candidate}.</Heading>
            {/* <Heading size="md" marginTop={3}>
              Är du säker?
            </Heading> */}
          </DrawerHeader>
          <DrawerBody>
            <HStack className="w-full mb-5">
              <Button
                className="flex-1 p-7"
                colorScheme="green"
                onClick={() => {
                  onClose();
                  addVote(candidate);
                  toast({
                    title: "Tack för din röst!",
                    description: `Din röst på ${candidate} har registrerats.`,
                    status: "success",
                    duration: 8000,
                    isClosable: false,
                    position: "top",
                  });
                }}
                ml={3}
              >
                SKICKA RÖST
              </Button>
              <Button
                className="flex-1 p-7"
                colorScheme={"red"}
                onClick={onClose}
              >
                AVBRYT
              </Button>
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
