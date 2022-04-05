import { Heading, VStack, Text } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { CandidateCard } from "../CandidateCard";

export const ResultsBoxAdmin = ({ voteCount, round }) => {
  const [data, setData] = useState(null);
  const [numOfVotes, setNumOfVotes] = useState(0);

  useEffect(() => {
    if (!voteCount) return;

    const totalVotes = voteCount.reduce((acc, [name, votes]) => acc + votes, 0);
    const percentagePerVote = 100 / totalVotes;

    const percentageData = voteCount
      .map(([c, v]) => [c, Math.floor(v * percentagePerVote * 100) / 100])
      .map(([name, percent]) => ({
        name: name,
        value: percent,
      }));

    setNumOfVotes(totalVotes);
    setData(percentageData);
  }, [voteCount]);

  return (
    <>
      <Heading className="text-center" size="md">
        RESULTAT
      </Heading>
      <Text fontSize={"lg"}>Antal röster: {numOfVotes}</Text>
      <VStack width="full" className="rounded-lg place-content-evenly">
        {data &&
          data
            .map((obj) => [obj.name, obj.value])
            .sort((a, b) => b[1] - a[1])
            .map(([name, percentageOfVotes], index, array) => {
              const loser = index === array.length - 1;
              return (
                <div
                  key={name}
                  className={`w-full ${
                    loser &&
                    (round.votingActive || round.done) &&
                    round.roundActive
                      ? "border-red-400 border-8 border-solid"
                      : ""
                  }
                  `}
                >
                  <CandidateCard
                    name={name}
                    text={`${percentageOfVotes}%`}
                    isLoaded={true}
                  />
                </div>
              );
            })}
      </VStack>
      {round.votingActive && (
        <>
          <AiOutlineArrowUp
            size={"100px"}
            className="animate-bounce"
            color="red"
          />
          <Heading className="text-center" size="md">
            TROLIG FÖRLORARE
          </Heading>
        </>
      )}
      {round.done && round.roundActive && (
        <>
          <AiOutlineArrowUp size={"100px"} color="red" />
          <Heading className="text-center" size="md">
            DEFINITIV FÖRLORARE
          </Heading>
        </>
      )}
    </>
  );
};
