import { Flex, Text } from "@chakra-ui/layout";

export const SessionInfoBox = ({ session }) => {
  return (
    <Flex className="flex-col justify-between p-2 border-2 border-black rounded-lg">
      <Text>
        <span className="font-bold">Status:</span>{" "}
        {session.active ? "Öppen" : "Stängd"}
      </Text>
      <Text>
        <span className="font-bold">Speldatum:</span>
        {new Date(session.showDate).toLocaleString()}
      </Text>

      <Text>
        <span className="font-bold">Scen:</span> {session.stage}
      </Text>
      <Text>
        <span className="font-bold">Stad:</span> {session.city}
      </Text>

      <Text>
        <span className="font-bold">Genomförd:</span>{" "}
        {session.done ? "Ja" : "Nej"}
      </Text>
      <Text>
        <span className="font-bold">Lösenord:</span> {session.secretWord}
      </Text>
    </Flex>
  );
};
