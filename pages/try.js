import {
  Box,
  Flex,
  Text,
  Button,
  Link,
  Center,
  Heading,
  VStack,
  HStack,
  Td,
  Tr,
  Table,
  TableBody,
  Avatar,
  Tbody,
  Spacer,
  Thead,
  Th,
  Tag,
  Spinner,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { debounce } from "lodash";
// import * as tf from "@tensorflow/tfjs";

import Script from "next/script";
import Head from "next/head";
import * as tf from "@tensorflow/tfjs";
import * as tmPose from "@teachablemachine/pose";
import { useState } from "react";

const userData = [
  {
    user: "John Doe",
    avg: "3.5",
    isSlouching: true,
  },
  {
    user: "Jane Doe",
    avg: "3.5",
    isSlouching: false,
  },
];

export default function Home() {
  const URL = "https://teachablemachine.withgoogle.com/models/C1GInu1hD/";
  let webcam, ctx, labelContainer, maxPredictions;

  const router = useRouter();
  const [model, setModel] = useState(null);
  const [modelURL, setModelURL] = useState(null);
  const [modaldataURL, setModalDataURL] = useState(null);
  const [isShoe, setIsShoe] = useState(null);
  const [cameraGood, setCameraGood] = useState(false);

  const startPose = async () => {
    getCanvas();

    maxPredictions = model.getTotalClasses();

    const webcamm = document.getElementById("wow");

    const ctx = webcamm.getContext("2d").getImageData(0, 0, 640, 480);

    // console.log(ctx);

    const { pose, posenetOutput } = await model.estimatePose(ctx, true);

    const prediction = await model.predict(posenetOutput);
    // console.log("CLASS 1: " + prediction[0].probability);
    // console.log("CLASS 2: " + prediction[1].probability);

    if (prediction[0].probability > prediction[1].probability) {
      setMessage(false);
    }
    if (prediction[1].probability > prediction[0].probability) {
      setMessage(true);
    }

    startPose();
  };

  const startWebcam = async () => {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    const model = await tmPose.load(modelURL, metadataURL);

    setModelURL(modelURL);
    setModalDataURL(metadataURL);
    setModel(model);

    const video = document.querySelector("video");
    const canvas = (window.canvas = document.querySelector("canvas"));

    canvas.width = 480;
    canvas.height = 360;

    const button = document.querySelector("button");

    const constraints = {
      audio: false,
      video: true,
    };

    function handleSuccess(stream) {
      window.stream = stream; // make stream available to browser console
      video.srcObject = stream;
      console.log("live!");
      setCameraGood(true);
    }

    function handleError(error) {
      console.log(
        "navigator.MediaDevices.getUserMedia error: ",
        error.message,
        error.name
      );
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError);
  };

  const getCanvas = () => {
    const video = document.querySelector("video");
    const canvas = (window.canvas = document.querySelector("canvas"));
    canvas.width = 480;
    canvas.height = 360;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  const setMessage = (isSlouching) => {
    if (isSlouching === true) {
      setIsShoe("🚨 Sit up straight homie");
    }
    if (isSlouching === false) {
      setIsShoe("✅ Great posture buddy :)");
    }
  };

  useEffect(() => {
    startWebcam();
  }, []);
  useEffect(() => {
    if (cameraGood == true) {
      startPose();
    }
  }, [cameraGood]);
  return (
    <Center h="90vh" pt={{ base: 12, md: 0 }} mx={{ base: 8, md: 0 }}>
      <Box>
        <Box rounded="lg" display={cameraGood ? "block" : "none"}>
          <Box rounded="lg" as="video" playsinlinec autoPlay></Box>
          <Box display="none">
            <canvas id="wow"></canvas>
          </Box>
        </Box>
        <Center
          display={cameraGood ? "none" : "flex"}
          rounded="lg"
          h={{ base: "20rem", md: "30rem" }}
          w={{ base: "19rem", md: "37rem" }}
          bg="gray.300"
        >
          <VStack spacing={2}>
            <Spinner size="xl" />
            <Text>Enable Camera Permissons...</Text>
          </VStack>
        </Center>
        <Box pt={4} rounded="md">
          {isShoe ? (
            <Box
              py={2}
              px={{ base: 6, md: 16 }}
              rounded="full"
              _hover={{ bg: "gray.900" }}
              onClick={() => {
                startPose();
              }}
              cursor="pointer"
              bg="black"
            >
              <Text
                textAlign="center"
                textColor="white"
                fontSize={{ base: "xl", md: "3xl" }}
              >
                {isShoe}
              </Text>
            </Box>
          ) : (
            <Box
              py={2}
              px={{ base: 6, md: 16 }}
              rounded="full"
              _hover={{ bg: "gray.900" }}
              onClick={() => {
                startPose();
              }}
              cursor="pointer"
              bg="black"
            >
              <Text
                textAlign="center"
                textColor="white"
                fontSize={{ base: "xl", md: "3xl" }}
              >
                model loading...
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Center>
  );
}
