import { createContext, useContext } from "react";
import { useSessionData } from "../hooks/useSessionData";
import { useAuth } from "./auth-context";

const SessionContext = createContext({
  isLoaded: false,
  session: [],
  rounds: [],
  votes: [],
});

const SessionProvider = ({ children }) => {
  const { user } = useAuth();

  //Get all data
  // TODO: Swap this for a better hook.
  const { activeSession, rounds, votes, allSessions } = useSessionData();

  const isLoaded = activeSession != null && rounds != null && votes != null;

  const activeRound = rounds
    ? rounds.find((r) => r.roundActive === true)
    : null;

  const votesInActiveRound =
    activeRound && votes
      ? votes.filter((v) => v.roundID === activeRound.roundID)
      : null;

  const userVoteInActiveRound =
    votesInActiveRound && user
      ? votesInActiveRound.find((v) => v.userEmail === user.email)
      : null;

  const currCandidates = activeSession ? activeSession.candidatesLeft : null;

  function calcultePercentage(voteCount) {
    const voteCountArray = Object.entries(voteCount);
    const totalVoteCount = voteCountArray.reduce((acc, [c, v]) => {
      return acc + v;
    }, 0);
    const percentagePerVote = 100 / totalVoteCount;

    const updatedVoteCountArray = voteCountArray.map(([c, v]) => [
      c,
      Math.floor(v * percentagePerVote * 100) / 100,
    ]);

    return Object.fromEntries(updatedVoteCountArray);
  }

  const voteCountInPercentage = activeRound
    ? calcultePercentage(activeRound.voteCount)
    : null;

  const value = {
    isLoaded,
    allSessions,
    activeSession,
    rounds,
    votes,
    activeRound,
    votesInActiveRound,
    userVoteInActiveRound,
    currCandidates,
    voteCountInPercentage,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

const useSessionContext = () => {
  return useContext(SessionContext);
};

export { SessionProvider, useSessionContext };
