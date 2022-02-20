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

  //Get all dat
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
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

const useSessionContext = () => {
  return useContext(SessionContext);
};

export { SessionProvider, useSessionContext };
