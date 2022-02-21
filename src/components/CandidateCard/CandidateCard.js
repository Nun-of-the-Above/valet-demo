import {
  Heading,
  Image,
  SkeletonCircle,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";
import { CANDIDATES_TOOLKIT } from "../../constants/CANDIDATES_TOOLKIT";

export const CandidateCard = ({ name, text, isLoaded }) => {
  const candidate = CANDIDATES_TOOLKIT[name];

  return (
    <VStack
      width="150px"
      height="200px"
      className="p-5 text-center border-2 rounded-2xl"
      borderColor={candidate.color}
    >
      <SkeletonCircle size="80px" isLoaded={isLoaded} fadeDuration={2}>
        <Image
          className="border-2 border-black rounded-full "
          boxSize="80px"
          fit="cover"
          src={`/${candidate.name}.png`}
          alt={candidate.name}
        />
      </SkeletonCircle>
      <SkeletonText isLoaded={isLoaded} fadeDuration={2} width="full">
        <Heading size="md" className="my-3">
          {candidate.name}
        </Heading>
        <Heading size="md">{text}</Heading>
      </SkeletonText>
    </VStack>
  );
};
