import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firestore";

export function useAdminData() {
  const [sessions, setSessions] = useState(null);
  const [rounds, setRounds] = useState(null);
  const [votes, setVotes] = useState(null);
  const [value, setValue] = useState({});

  // Get all sessions
  useEffect(() => {
    const sessionsQuery = query(collection(db, "sessions"));

    const unsubSession = onSnapshot(sessionsQuery, (querySnapshot) => {
      const allSessions = querySnapshot.docs.map((doc) => doc.data());
      setSessions(allSessions);
    });

    return () => unsubSession();
  }, []);

  // Get all rounds
  useEffect(() => {
    const roundsQuery = query(collection(db, "rounds"));

    const unsubRounds = onSnapshot(roundsQuery, (querySnapshot) => {
      const newRounds = querySnapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a.number - b.number);

      setRounds(newRounds);
    });

    return () => unsubRounds();
  }, []);

  // Get all votes
  useEffect(() => {
    const votesQuery = query(collection(db, "votes"));

    const unsubVotes = onSnapshot(votesQuery, (querySnapshot) => {
      setVotes(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubVotes();
  }, []);

  useEffect(() => {
    setValue({
      sessions: sessions,
      rounds: rounds,
      votes: votes,
    });
  }, [sessions, rounds, votes]); // eslint-disable-line no-eval

  return value;
}
