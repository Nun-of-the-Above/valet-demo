import { useEffect, useState } from "react";

//Will be with user as well
export const RoundTimer = ({ round }) => {
  const [seconds, setSeconds] = useState(60);
  const [intervalState, setIntervalState] = useState(null);
  localStorage.setItem("key", "value");

  useEffect(() => {
    if (!round.votingActive) return;
    console.log(localStorage.getItem(round.roundID));
    if (localStorage.getItem(round.roundID)) {
      if (intervalState === null) {
        const startTime = new Date(localStorage.getItem(round.roundID));
        const currentTime = new Date();

        const diff = Math.ceil((currentTime - startTime) / 1000);

        setSeconds(60 - diff);
      }
    } else {
      localStorage.setItem(round.roundID, new Date());
    }
  }, [round]);

  useEffect(() => {
    console.log(round);
    if (round.votingActive && intervalState === null) {
      setIntervalState(
        setInterval(() => {
          setSeconds((seconds) => seconds - 1);
        }, 1000)
      );
    } else if (!round.votingActive) {
      clearInterval(intervalState);
    }
    // return () => {
    // console.log("Clean up happened.");
    // clearInterval(intervalState);
    // };
  }, [round]);

  return (
    <div>
      {round.done ? <p>Voting is done.</p> : <p>Vote countdown: {seconds}</p>}
    </div>
  );
};
