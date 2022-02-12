import { useAuth } from "../../context/auth-context";
import { useSessionContext } from "../../context/session-context";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { Button } from "@chakra-ui/button";
import {
  Box,
  Center,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { VotingBox } from "../../components/VotingBox";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

export function UserPanel() {
  const { logout } = useAuth();

  const { isLoaded, activeSession, activeRound, currCandidates } =
    useSessionContext();

  // If there is no session, logout the user.
  useEffect(() => {
    if (activeSession && !activeSession.active) {
      logout();
    }
  }, [activeSession]);

  return (
    <div className="relative min-w-full min-h-full">
      {isLoaded ? (
        <Box>
          {activeRound && (
            <>
              {!activeRound && !activeSession.done && (
                <p>No round active right now.</p>
              )}

              {activeRound.roundActive &&
                !activeRound.votingActive &&
                !activeRound.done && (
                  <VStack>
                    <Text>A round is active.</Text>
                    <Text>Wait for the voting to start...</Text>
                  </VStack>
                )}

              {activeRound.votingActive && <VotingBox />}

              {activeRound.done && !activeRound.displayResults && (
                <VStack>
                  <Text>Voting is done.</Text>
                  <Text>Wait for results.</Text>
                </VStack>
              )}

              {activeRound.displayResults && <ResultsBox />}

              {activeSession.done && (
                <p>The session is done! Winner is {currCandidates}</p>
              )}
            </>
          )}

          {!activeRound && (
            <VStack>
              <Text>No round active.</Text>
              <Text>Watch the show!</Text>
            </VStack>
          )}
        </Box>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

const ResultsBox = () => {
  const { activeRound, voteCountInPercentage } = useSessionContext();

  console.log(voteCountInPercentage);
  const data = Object.entries(voteCountInPercentage)
    .sort((a, b) => a[1] - b[1])
    .map(([name, percent]) => {
      return { name: name, value: percent };
    });

  console.log(data);

  return (
    <>
      {activeRound && activeRound.displayResults && (
        <>
          <Heading size="md" className="text-center">
            RESULTS
          </Heading>
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
              animationDuration={2000}
              animationEasing="ease-in-out"
            />
          </PieChart>
          {Object.entries(voteCountInPercentage)
            .sort((a, b) => b[1] - a[1])
            .map(([candidate, voteCount]) => (
              <Text key={uuidv4()} className="text-center">
                {candidate}: {voteCount}%
              </Text>
            ))}
        </>
      )}
    </>
  );
};
