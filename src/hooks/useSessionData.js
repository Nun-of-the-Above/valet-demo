import { collection, query, where, onSnapshot } from "@firebase/firestore";
import { db } from "../firestore";
import { useEffect, useState } from "react";
const R = require("ramda");

// Gets active session from firestore
export function useSessionData() {
  const [votes, setVotes] = useState(null);
  const [rounds, setRounds] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [allSessions, setAllSessions] = useState(null);
  const [value, setValue] = useState({});

  // Get all the sessions
  useEffect(() => {
    const sessionsQuery = query(collection(db, "sessions"));

    const unsubSession = onSnapshot(sessionsQuery, (querySnapshot) => {
      const sessions = querySnapshot.docs.map((doc) => doc.data());
      setAllSessions(sessions);
    });

    return () => unsubSession();
  }, []);

  // Get the active session
  useEffect(() => {
    const sessionQuery = query(
      collection(db, "sessions"),
      where("active", "==", true)
    );

    const unsubSession = onSnapshot(sessionQuery, (querySnapshot) => {
      if (querySnapshot.size === 1) {
        const session = querySnapshot.docs[0].data();

        setActiveSession(session);
      } else {
        setActiveSession({});
        setRounds(null);
        setVotes(null);
      }
    });

    return () => unsubSession();
  }, []);

  // Get rounds based on active session
  useEffect(() => {
    //Not sure if this check works
    if (!activeSession || R.isEmpty(activeSession)) return;

    const roundsQuery = query(
      collection(db, "rounds"),
      where("parentSessionID", "==", activeSession.sessionID)
    );

    const unsubRounds = onSnapshot(roundsQuery, (querySnapshot) => {
      if (querySnapshot.size === 3) {
        const newRounds = querySnapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.number - b.number);

        setRounds(newRounds);
      } else {
        setRounds(null);
      }
    });

    return () => {
      // console.log("unsubbed from old rounds...");
      unsubRounds();
    };
  }, [activeSession]);

  useEffect(() => {
    if (!rounds) return;
    const votesQuery = query(
      collection(db, "votes"),
      where(
        "roundID",
        "in",
        rounds.map((round) => round.roundID)
      )
    );

    // console.log("Creating new votes sub");
    const unsubVotes = onSnapshot(votesQuery, (querySnapshot) => {
      // Here we know that all data is gathered (session, rounds)
      setVotes(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => {
      // console.log("unsubbing from old votes sub");
      unsubVotes();
    };
  }, [rounds]);

  useEffect(() => {
    setValue({
      allSessions: allSessions,
      activeSession: activeSession,
      rounds: rounds,
      votes: votes,
    });
  }, [votes, allSessions]); // eslint-disable-line no-eval

  return value;
}
