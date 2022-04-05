import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firestore";
import { getDatabase, ref, onValue } from "firebase/database";
const R = require("ramda");

// Gets all sessions and the active session for the UserPanel through a provider.
export function useSessionData() {
  const [votes, setVotes] = useState(null);
  const [rounds, setRounds] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [allSessions, setAllSessions] = useState(null);
  const [timer, setTimer] = useState(null);
  const [value, setValue] = useState({});
  const realTimeDatabase = getDatabase();

  // Get the countdown timer from the RTDB
  useEffect(() => {
    const timerRef = ref(realTimeDatabase, "timer");
    const unsubTimer = onValue(timerRef, (snapshot) => {
      const data = snapshot.val();
      setTimer(data.value);
    });
    return unsubTimer;
  }, [realTimeDatabase]);

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
    // TODO: Double-check that this check works properly.
    if (!activeSession || R.isEmpty(activeSession)) return;

    const roundsQuery = query(
      collection(db, "rounds"),
      where("parentSessionID", "==", activeSession.sessionID)
    );

    const unsubRounds = onSnapshot(roundsQuery, (querySnapshot) => {
      if (querySnapshot.size >= 3) {
        const newRounds = querySnapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.number - b.number);

        setRounds(newRounds);
      } else {
        setRounds(null);
      }
    });

    return () => {
      unsubRounds();
    };
  }, [activeSession]);

  // Get votes for each round.
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

    const unsubVotes = onSnapshot(votesQuery, (querySnapshot) => {
      setVotes(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => {
      unsubVotes();
    };
  }, [rounds]);

  // TODO: Rebuild this. Creates too many reads atm.
  useEffect(() => {
    setValue({
      allSessions: allSessions,
      activeSession: activeSession,
      rounds: rounds,
      votes: votes,
      timer: timer,
    });
  }, [votes, allSessions]);

  return value;
}
