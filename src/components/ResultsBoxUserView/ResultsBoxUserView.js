import { Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { useSessionContext } from "../../context/session-context";

export const ResultsBoxUserView = () => {
  const { activeRound, votesInActiveRound, currCandidates } =
    useSessionContext();

  const [voteCount, setVoteCount] = useState(null);
  const [data, setData] = useState(null);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (!votesInActiveRound || !currCandidates) return;
    const voteMap = new Map();

    currCandidates.forEach((candidate) => voteMap.set(candidate, 0));

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

  // TODO: Put these in a TOOLKIT for the candidates.
  // Ex. {name: 'Alina', image: 'url', color: '#00C49F'}
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      {activeRound && activeRound.displayResults && (
        <>
          <Heading className="text-center" size="md">
            RESULTS
          </Heading>
          <VStack width={"100%"}>
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
                animationDuration={1000}
                animationEasing="ease-in-out"
                label={(entry) => `${entry.name}`}
                onAnimationEnd={() => setAnimationDone(true)}
              >
                {data &&
                  data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              ;
            </PieChart>

            {voteCount && data && animationDone && (
              <VStack border="1px" padding="3" className="rounded-lg">
                {data
                  .map((obj) => [obj.name, obj.value])
                  .sort((a, b) => b[1] - a[1])
                  .map(([candidate, numOfVotes]) => (
                    <Text key={candidate}>
                      {candidate}: {numOfVotes}%
                    </Text>
                  ))}
              </VStack>
            )}
          </VStack>
        </>
      )}
    </>
  );
};
