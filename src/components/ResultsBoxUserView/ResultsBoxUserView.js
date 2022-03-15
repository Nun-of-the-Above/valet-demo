import { Heading, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { CANDIDATES_TOOLKIT } from "../../constants/CANDIDATES_TOOLKIT";
import { useSessionContext } from "../../context/session-context";
import { CandidateCard } from "../CandidateCard";
import { Grid, GridItem } from "@chakra-ui/react";

export const ResultsBoxUserView = () => {
  const { activeRound, votesInActiveRound, currCandidates } =
    useSessionContext();

  const [voteCount, setVoteCount] = useState(null);
  const [data, setData] = useState(null);
  const [animationDone, setAnimationDone] = useState(false);
  const testCandidates = ["Regn", "Blåsigt", "Åska", "Sol"];

  useEffect(() => {
    if (!votesInActiveRound || !currCandidates) return;
    const voteMap = new Map();

    if (activeRound.number === 0) {
      testCandidates.forEach((candidate) => voteMap.set(candidate, 0));
    } else {
      currCandidates.forEach((candidate) => voteMap.set(candidate, 0));
    }

    votesInActiveRound.forEach((vote) => {
      voteMap.set(vote.candidate, Number(voteMap.get(vote.candidate) + 1));
    });

    setVoteCount([...voteMap].sort((a, b) => a[1] - b[1]));
  }, [votesInActiveRound]);

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

    setData(percentageData);
  }, [voteCount]);

  return (
    <>
      {activeRound && activeRound.displayResults && (
        <>
          <VStack width={"100%"} height="100%">
            <Heading className="text-center" size="md">
              RESULTAT
            </Heading>
            <PieChart width={300} height={150} className="self-center mb-5">
              <Pie
                nameKey="name"
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={data}
                cx="50%"
                cy="100%"
                outerRadius={70}
                fill="#8884d8"
                animationDuration={2500}
                animationEasing="ease-in-out"
                label={(entry) => `${entry.name}`}
                onAnimationEnd={() => setAnimationDone(true)}
              >
                {data &&
                  data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CANDIDATES_TOOLKIT[entry.name].color}
                    />
                  ))}
              </Pie>
            </PieChart>

            {data ? (
              <Grid
                padding="3"
                className="rounded-lg"
                templateColumns="1fr 1fr"
              >
                {data
                  .map((obj) => [obj.name, obj.value])
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, percentageOfVotes]) => (
                    <GridItem key={name} className="m-3">
                      <CandidateCard
                        name={name}
                        text={`${percentageOfVotes}%`}
                        isLoaded={animationDone}
                      />
                    </GridItem>
                  ))}
              </Grid>
            ) : (
              <>
                {data && (
                  <Grid
                    padding="3"
                    className="rounded-lg"
                    templateColumns="1fr 1fr"
                  >
                    {data
                      .map((obj) => [obj.name, obj.value])
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, percentageOfVotes]) => (
                        <GridItem key={name}>
                          <Skeleton height="50px" width="50px" />
                        </GridItem>
                      ))}
                  </Grid>
                )}
              </>
            )}
          </VStack>
        </>
      )}
    </>
  );
};
