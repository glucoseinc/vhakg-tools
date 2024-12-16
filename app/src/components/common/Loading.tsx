import {
  Center,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

const Loading = () => {
  return (
    <Center>
      <HStack>
        <Spinner />
        <VStack>
          <Heading>Loading database...</Heading>
          <Text>
            If this process takes too long, please check if the database container
            is running.
          </Text>
        </VStack>
      </HStack>
    </Center>
  );
};
export default Loading;
