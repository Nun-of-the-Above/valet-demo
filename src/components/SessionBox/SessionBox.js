import { Button } from "@chakra-ui/button";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import { collection, doc, updateDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useAdminContext } from "../../context/admin-context";
import { db } from "../../firestore";
import { DeactivateSessionButton } from "../DeactivateSessionButton";
import { DeleteSessionButton } from "../DeleteSessionButton";
import { RoundBox } from "../RoundBox";

export function SessionBox({ session }) {
  const { rounds, sessions } = useAdminContext();
  const [activeSession, setActiveSession] = useState(null);
  const [allRoundsDone, setAllRoundsDone] = useState(false);

  useEffect(() => {
    if (!sessions) return;
    const anActiveSession = sessions.find((s) => s.active === true);
    if (anActiveSession) {
      setActiveSession(anActiveSession);
    }
  }, [sessions, activeSession]);

  //TODO: Button remains enabled. Don't know how to fix this yet. Something todo with refresh cycles and how I'm subscribing from firestore.
  useEffect(() => {
    if (!rounds) return;
    const doneAndClosed = rounds
      .filter((r) => r.parentSessionID === session.sessionID)
      .every((r) => r.done === true && r.roundActive === false);
    if (doneAndClosed) {
      setAllRoundsDone(true);
    }
  }, [rounds, allRoundsDone, session]);

  return (
    <>
      {!session ? (
        <Spinner />
      ) : (
        <Box
          className="flex-col p-3 mb-10 rounded-md"
          bgColor={session.active ? "green.100" : "gray.100"}
          border={session.active ? "3px solid green" : "1px solid black"}
        >
          <Heading as="h2" size="sm" className="text-center ">
            {new Date(session.showDate).toDateString()}, {session.stage},{" "}
            {session.city}
          </Heading>
          {/* <SessionInfoBox session={session} /> */}

          <VStack className="justify-around my-8">
            <ActivateSessionButton session={session} disabled={activeSession} />
            <DeactivateSessionButton
              session={session}
              disabled={!allRoundsDone}
            />
            <DeleteSessionButton session={session} />
          </VStack>

          <div className="flex flex-col">
            {rounds &&
              rounds
                .filter((round) => round.parentSessionID === session.sessionID)
                .map((round, i, rounds) => {
                  let shouldBeActive = false;
                  const roundsSorted = rounds
                    .map((round) => round)
                    .sort((a, b) => a[0] - b[0]);

                  const roundBefore = roundsSorted[round.number - 2];

                  if (round.number === 1) {
                    shouldBeActive = true;
                  } else if (
                    roundBefore &&
                    roundBefore.done &&
                    !roundBefore.roundActive
                  ) {
                    shouldBeActive = true;
                  }

                  return (
                    <RoundBox
                      key={round.roundID}
                      round={round}
                      disabled={!session.active || !shouldBeActive}
                    />
                  );
                })}
          </div>
        </Box>
      )}
    </>
  );
}

const ActivateSessionButton = ({ session, disabled }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <Button
      w={"full"}
      colorScheme={"green"}
      disabled={session.active || session.done || disabled}
      onClick={() => {
        updateDoc(sessionRef, { active: true });
      }}
    >
      ??PPNA F??REST??LLNING
    </Button>
  );
};

const SetSessionDoneButton = ({ session, disabled }) => {
  const sessionRef = doc(collection(db, "sessions"), session.sessionID);

  return (
    <Button
      w={"full"}
      onClick={() => {
        updateDoc(sessionRef, { done: true });
      }}
      disabled={disabled}
    >
      S??tt till klar och visa sista bild
    </Button>
  );
};
