import { EmailIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { DayFormat } from "../TextFromat.jsx";
import { config } from "../../config.js";
import { Brand } from "../../util/Theme.js";


export function DmGroup({ children }) {
  const DmGroupHeader = React.Children.toArray(children).filter(
    (child) => child.type.name === "DmGroupHeader"
  );
  const DmGroupBody = React.Children.toArray(children).filter(
    (child) => child.type.name === "DmGroupBody"
  );
  return (
    <Box maxW={"400px"} w={"100%"}>
      { children }
    </Box>
  );
}

export function DmGroupHeader(props) {
  return (
    <>
      <HStack borderBottomWidth={1}>
        <Heading as="h2" size="md" ml={5}>
          DMGroup
        </Heading>
        <Spacer />
        <IconButton
          icon={<EmailIcon />}
          variant={"ghost"}
          onClick={props.onOpen}
        />
      </HStack>
      {props.children}
    </>
  );
}

export function DmGroupBody({ children }) {
  return (
    <VStack
      spacing={0}
      alignItems={"flex-start"}
      overflowY={"auto"}
      overflowX={"hidden"}
      h={"calc(100vh - 246px)"}
      sx={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: Brand["100.5"],
          borderRadius: "24px",
        },
      }}
    >
      {children}
    </VStack>
  );
}

export function DmGroupBox(props) {
  return (
    <Box
      p="10px"
      w="100%"
      position="relative"
      _hover={{
        background: "green.100",
        cursor: "pointer",
      }}
      onClick={() => props.onClick(props.groupId)}
      _after={{
        content: '""',
        display: "block",
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        pointerEvents: "none",
        backgroundImage:
          "radial-gradient(circle, rgba(0, 0, 0, 0.3) 10%, transparent 10.01%)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50%",
        transform: "scale(10, 10)",
        opacity: 0,
        transition: "transform 0.5s, opacity 1s",
      }}
      _active={{
        _after: {
          transform: "scale(0, 0)",
          opacity: 0.2,
          transition: "0s",
        },
      }}
    >
      <HStack alignItems={"flex-start"}>
        <Avatar size={"md"} src={props.avatar}>
          <AvatarBadge boxSize="1.25em" bg="green.500" />
        </Avatar>
        <Box px={"3px"} overflow={"hidden"}>
          <Flex>
            <Heading as="h3" size="sm">
              {props.groupName}
            </Heading>
            <DayFormat
              rootOption={{ pl: "10px" }}
              textOption={{
                fontSize: "sm",
                opacity: "0.3",
                whiteSpace: "nowrap",
              }}
              date={props.date}
              yearSpace={"年"}
              monthSpace={"月"}
              daySpace={"日"}
            />
          </Flex>
          <Text opacity={"0.5"} isTruncated>
            {props.message}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}

export function DmGroupCreate(props) {
  const [userID, setUserID] = useState("");
  const [userIDCheck, setUserIDCheck] = useState(false);
  const [time, setTime] = useState(null);
  const checkUserID = (event) => {
    const value = event.target.value.replace("@", "");
    setUserID(value);
    setUserIDCheck(false);
    clearTimeout(time);
    const newTime = setTimeout(() => {
      fetch(`${config.apiUrl}/api/v1/user/check/id?user_id=${value}`, {
        method: "GET",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((data) => {
          setUserIDCheck(data.status);
        });
    }, 500);
    setTime(newTime);
  };
  const createDMGroup = () => {
    if (!userID) {
      console.log("userName is empty");
      return;
    }
    props.onClose();
    fetch(`${config.apiUrl}/api/v1/dm/createDMGroup`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({
          target_user_id: userID,
          group_id: data.group_id,
        });
        fetch(`${config.apiUrl}/api/v1/dm/addDMUser`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: JSON.stringify({
            target_user_id: userID,
            group_id: data.group_id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>DMグループ作成</ModalHeader>
        <ModalBody>
          <Input
            placeholder="ユーザーID"
            onChange={(e) => checkUserID(e)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={createDMGroup} isDisabled={!userIDCheck}>
            作成
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
