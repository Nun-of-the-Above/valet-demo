import {
  Heading,
  Image,
  SkeletonCircle,
  SkeletonText,
  HStack,
} from "@chakra-ui/react";
import { CANDIDATES_TOOLKIT } from "../../constants/CANDIDATES_TOOLKIT";

export const CandidateCard = ({ name, text, isLoaded }) => {
  const candidate = CANDIDATES_TOOLKIT[name];

  return (
    <HStack
      className="w-full p-3 text-center text-white border-2 rounded-2xl"
      bgColor={isLoaded ? candidate.color : "#e3e1dc"}
    >
      <SkeletonCircle
        minW="70px"
        minH="70px"
        isLoaded={isLoaded}
        fadeDuration={2}
        className="mr-1"
      >
        <Image
          className="rounded-full"
          boxSize="70px"
          fit="cover"
          src={`${candidate.image}`}
          alt={candidate.name}
        />
      </SkeletonCircle>

      <SkeletonText
        isLoaded={isLoaded}
        fadeDuration={2}
        width="full"
        noOfLines={2}
        className="pr-3"
      >
        <HStack justify="space-between">
          <Heading size="md" className="my-3">
            {candidate.name}
          </Heading>
          <Heading size="md">{text}</Heading>
        </HStack>
      </SkeletonText>
    </HStack>
  );
};
