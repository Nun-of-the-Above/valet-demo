import { Center, Heading } from "@chakra-ui/react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSessionContext } from "../../context/session-context";
import { db } from "../../firestore";
import { getDatabase, ref, set, onValue } from "firebase/database";

//Will be with user as well
export const RoundTimer = ({ round, setVotingEnabled, isAdmin }) => {
  // const TIMER_DURATION = round.number === 0 ? 30 : 60;
  // const TIMER_DURATION = 60;
  const { timer } = useSessionContext();
  const [seconds, setSeconds] = useState(timer);
  const [intervalState, setIntervalState] = useState(null);
  const database = getDatabase();

  useEffect(() => {
    if (isAdmin) {
      writeTimeToDb(seconds);
    }
  }, [seconds, isAdmin]);

  function writeTimeToDb(seconds) {
    set(ref(database, "timer"), {
      value: seconds,
    });
  }

  //When component mounts, get the startTime from the round.roundTimer.
  //UserPanel has useEffect that gets timer state from round.roundTimer in firestore.

  //Storing state of timer in localStorage
  useEffect(() => {
    if (!round.votingActive) return;
    if (localStorage.getItem(round.roundID)) {
      if (intervalState === null) {
        const startTime = new Date(localStorage.getItem(round.roundID));
        const startingInterval = localStorage.getItem(
          round.roundID + "_initialTimer"
        );
        const currentTime = new Date();

        const diff = Math.ceil((currentTime - startTime) / 1000);

        setSeconds(startingInterval - diff);
      }
    } else {
      localStorage.setItem(round.roundID, new Date());
      localStorage.setItem(round.roundID + "_initialTimer", timer);
    }
  }, [round, intervalState]);

  useEffect(() => {
    if (round.votingActive && intervalState === null) {
      setIntervalState(
        setInterval(() => {
          setSeconds((seconds) => seconds - 1);
        }, 1000)
      );
    } else if (!round.votingActive) {
      clearInterval(intervalState);
    }
    //This is a known memeory leak. Don't think it'll cause a problem.
    // return () => {
    // console.log("Clean up happened.");
    // clearInterval(intervalState);
    // };
  }, [round]);

  // useEffect(() => {
  //   if (isAdmin) {
  //     updateDoc(doc(db, "rounds", round.roundID), {
  //       timer: seconds - 1,
  //     }).then(() => {
  //       console.log("Updated timer to: ", seconds);
  //     });
  //   }
  // }, [seconds, isAdmin, round.roundID]);

  useEffect(() => {
    if (seconds <= 0 && setVotingEnabled) {
      setVotingEnabled(false);
    }
  }, [seconds, setVotingEnabled]);

  return (
    <Center>
      {round.done ? (
        <Heading size="3xl">Klar.</Heading>
      ) : (
        <>
          {/* <Heading size="3xl">Timer: {timer}</Heading> */}
          <Heading size="3xl">{seconds}</Heading>
          {/* <button onClick={() => writeTimeToDb(seconds)}>Write to DB</button> */}
        </>
      )}
    </Center>
  );
};
//
