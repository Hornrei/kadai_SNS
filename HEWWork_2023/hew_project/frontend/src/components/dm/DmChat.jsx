import React, { useRef, useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Spacer,
  Text,
  VStack,
  FormControl,
  FormLabel,
  ModalFooter,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowRightIcon,
  Icon,
  PlusSquareIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { config } from "../../config";
import { Brand } from "../../util/Theme";
import { Theme } from "@fullcalendar/core/internal";

export function DmChatMessage(props) {
  return (
    <>
      {props.type == "receive" ? (
        <HStack width={"100%"} alignItems={"flex-start"} p={3}>
          <Avatar src={props.iconURL} boxSize={"38px"} mt={1} />
          <Box>
            <Heading as="h3" size="sm" mt={"-3px"}>
              {props.userName}
            </Heading>
            <Box
              bgColor={"gray.300"}
              borderRadius={"6px"}
              position={"sticky"}
              mt={1}
              _before={{
                content: '""',
                position: "absolute",
                borderStyle: "solid",
                borderWidth: "5px",
                borderColor: "gray.300",
                borderTopColor: "transparent",
                borderLeftColor: "transparent",
                borderBottomColor: "transparent",
                width: "0",
                height: "0",
                mt: "4px",
                marginLeft: "-8px",
              }}
              w={"fit-content"}
            >
              <Text p={2} whiteSpace={"pre-wrap"} >
                {props.message}
              </Text>
            </Box>
          </Box>
        </HStack>
      ) : (
        <HStack
          width={"100%"}
          alignItems={"flex-start"}
          p={3}
          justifyContent={"flex-end"}
        >
          <Box>
            <Heading as="h3" size="sm" mt={"-3px"} textAlign={"right"}>
              {props.userName}
            </Heading>
            <Box
              bgColor={"gray.300"}
              borderRadius={"6px"}
              position={"sticky"}
              mt={1}
              w={"fit-content"}
              _before={{
                content: '""',
                position: "absolute",
                borderStyle: "solid",
                borderWidth: "5px",
                borderColor: "gray.300",
                borderTopColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "transparent",
                width: "0",
                height: "0",
                right: "-2",
                mt: "4px",
                mr: "-1px",
              }}
              ml={"auto"}
            >
              <Text p={2} whiteSpace={"pre-wrap"}>
                {props.message}
              </Text>
            </Box>
          </Box>
          <Avatar src={props.iconURL} boxSize={"38px"} mt={1} />
        </HStack>
      )}
    </>
  );
}

export function DmChatHeaderAddUserModal(props) {
  const [value, setValue] = useState("");
  const addDMUser = () => {
    fetch(`${config.apiUrl}/api/v1/dm/addDMUser`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        target_user_id: value,
        group_id: props.groupId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ng") {
          return;
        }
        props.onClose();
      });
  };
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ユーザーを追加</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>ユーザー名</FormLabel>
            <Input
              placeholder="ユーザー名"
              onChange={(e) => setValue(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mt={4} colorScheme="teal" onClick={addDMUser}>
            追加
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function DmChatHeader(props) {
  return (
    <>
      {props.children}
      <HStack borderBottomWidth={"1px"} position={"sticky"}>
        <IconButton
          icon={<ArrowBackIcon />}
          variant={"ghost"}
          onClick={props.backSubmit}
          isDisabled={props.isDisabled}
        />
        <Heading as="h2" size="md" mx={5} isTruncated>
          {props.dmName}
        </Heading>
        <Spacer />
        <Popover>
          <PopoverTrigger>
            <IconButton
              icon={<HamburgerIcon />}
              variant={"ghost"}
              isDisabled={props.isDisabled}
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent w={""} margin={0}>
              <PopoverArrow />
              <PopoverBody p={1}>
                <VStack spacing={0} textAlign={"center"}>
                  <Text
                    onClick={props.addUserClick}
                    w={"100%"}
                    p={1}
                    _hover={{ bgColor: "green.100" }}
                  >
                    ユーザーを追加
                  </Text>
                  <Text
                    w={"100%"}
                    p={1}
                    _hover={{ bgColor: "green.100" }}
                    onClick={props.detachDMGroup}
                  >
                    DMを脱退
                  </Text>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </HStack>
    </>
  );
}

export function DmChatBody(props) {
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [props?.children?.length]);
  console.log(props?.children?.length);
  return (
    <VStack
      ref={scrollRef}
      spacing={0}
      w={"100%"}
      alignItems={"flex-start"}
      overflowY={"auto"}
      overflowX={"hidden"}
      h={"calc(100vh - 248px)"}
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
      {...props}
    ></VStack>
  );
}

export function DmChat({ children }) {
  console.log(children)
  const DmChatHeader = React.Children.toArray(children).filter(
    (child) => child.type.name === "Show"
  );
  const DmChatBody = React.Children.toArray(children).filter(
    (child) => child.type.name === "DmChatBody"
  );
  const DmChatFooter = React.Children.toArray(children).filter(
    (child) => child.type.name === "DmChatFooter"
  );

  return (
    <>
      <Box
        maxW={"600px"}
        w={"100%"}
        borderLeftWidth={1}
        borderRightWidth={1}
        position={"relative"}
        overflow={"hidden"}
      >
        { children }
      </Box>
    </>
  );
}

export function DmChatFooter(props) {
  return (
    <Box
      position={"sticky"}
      p={3}
      backgroundColor={Theme["50"]}
      bottom={0}
      borderTopWidth={1}
    >
      <InputGroup>
        <Input
          placeholder="メッセージを入力"
          onChange={(e) => {
            props.message(e.target.value);
          }}
          // onCompositionEnd={}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value !== "") {
              props.sendMessage();
              e.target.value = "";
              props.message("");
            }
          }}
          isDisabled={props.isDisabled}
          id="inputMessage"
        />
        <InputLeftElement>
          <IconButton
            icon={<PlusSquareIcon />}
            variant={"ghost"}
            isDisabled={props.isDisabled}
          />
        </InputLeftElement>
        <InputRightElement>
          <IconButton
            icon={<ArrowRightIcon />}
            variant={"ghost"}
            onClick={() => {
              props.sendMessage();
              props.message("");
              document.getElementById("inputMessage").value = "";
            }}
            isDisabled={props.isDisabled}
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}
