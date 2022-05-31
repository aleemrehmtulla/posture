import Head from "next/head";
import { Box, Text, Link, Center, Heading, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <Head>
        <title>posture.so</title>
        <meta property="og:image" content="https://posture.so/posture.png" />
        <meta property="og:title" content="posture.so" />
        <meta
          property="og:description"
          content="posture.so is a web-app giving you not-so-friendly reminders about your posture."
        />
      </Head>
      <Center px={8} h="90vh">
        <VStack spacing={2}>
          <Heading fontSize="6xl">posture.so</Heading>
          <Text w={{ base: 80, md: 96 }} pb={4} textAlign="center">
            A web-app giving you not-so-friendly reminders about your posture.
          </Text>
          <Box
            py={2}
            px={14}
            rounded="full"
            _hover={{ bg: "gray.900" }}
            cursor="pointer"
            bg="black"
            onClick={() => {
              location.href = "/try";
            }}
          >
            <Text textColor="white" fontSize="3xl">
              try now
            </Text>
          </Box>
        </VStack>
      </Center>
      <Text px={2} textAlign="center">
        made with bad posture by{" "}
        <Link href="https://twitter.com/aleemrehmtulla">@aleemrehmtulla</Link>
      </Text>
    </>
  );
}
