import React, { useEffect } from "react";
import {
  Box,
  Center,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  IconButton,
  Container,
  Flex,
  VStack,
  Stack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Text,
  Show,
  Hide,
  useMediaQuery,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FcGoogle } from "react-icons/fc";

import logo1 from "../assets/campection2.png";
import googleIcon from "../assets/google_icon.png";
import lineIcon from "../assets/LINE_icon.png";
import facebookIcon from "../assets/Facebook_icon.png";

import oldLogo from "../assets/logo1.png";

import { SmallUserBox } from "../components/UserBox.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { PostModal } from "../components/PostModal.jsx";
import { UserCard } from "../components/UserCard";
import { LeftIconBar } from "../components/LeftIconBar";
import { RightUserList } from "../components/RightUserList";
import { config } from "../config.js";
import { Brand } from "../util/Theme.js";

// import { useNavigate } from "react-router-dom"

function Login() {
  // const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleClick = (param) => {
    window.location.href = `${config.apiUrl}/api/v1/auth/login/${param}`;
  };
  const setDevUser = (id) => {
    fetch(`${config.apiUrl}/api/v1/dev/set_auth_cookie?user_id=${id}`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    }).then((res) => {
      window.location.href = "http://127.0.0.1:5173/";
    });
  };

  return (
    <>
      <Box backgroundColor={Brand["100.5"]}>
        <Center>
          <Image
            src={logo1}
            h={"70px"}
            onClick={(event) => {
              if (event.shiftKey && event.ctrlKey) {
                setDevUser("user01");
              }
            }}
          />
        </Center>
      </Box>
      <Box paddingTop={"30px"} h={"calc(100vh - 70px)"}>
        <Center fontSize={"35px"} marginBottom={"30px"}>
          ログイン
        </Center>
        <Center>
          <VStack w={"400px"}>
            <Button
              onClick={() => handleClick("google")}
              leftIcon={<Icon as={FcGoogle} fontSize={"1.8em"}></Icon>}
              fontSize={"22px"}
              h={"60px"}
              margin={"10px"}
              w={"100%"}
            >
              <Text w={"100%"} textAlign={"left"}>Continue with Google</Text>
            </Button>
            <Button
              onClick={() => handleClick("line")}
              fontSize={"22px"}
              h={"60px"}
              w={"100%"}
              margin={"10px"}
              leftIcon={
                <Image src={lineIcon} h={"40px"} borderRadius={10}></Image>
              }
            >
              <Text w={"100%"} textAlign={"left"}>
                Continue with LINE
              </Text>
            </Button>

            <Button
              onClick={() => handleClick("hew")}
              fontSize={"22px"}
              h={"60px"}
              margin={"10px"}
              w={"100%"}
              marginBottom={"60px"}
              leftIcon={
                <Image src={oldLogo} h={"40px"}></Image>}
            >
              <Text w={"100%"} textAlign={"left"}>
                Continue with Campection
              </Text>
            </Button>
          </VStack>
        </Center>
      </Box>
    </>
  );
}

export default Login;
