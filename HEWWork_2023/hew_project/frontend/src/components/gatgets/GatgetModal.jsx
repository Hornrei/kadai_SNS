import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Switch,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { config } from "../../config";

export function AddNewGadget(props) {
  const rentalStatus = useDisclosure();
  const inputRef = React.useRef(null);
  const [imageURL, setImageURL] = useState(
    "https://via.placeholder.com/1920x1080"
  );

  const [gadgetData, setGadgetData] = useState({
    gadget_name: "",
    gadget_content: "",
    gadget_tag1: "",
    gadget_tag2: "",
    gadget_tag3: "",
    rental_status: rentalStatus.isOpen,
    image_uuid: "",
  });

  const handleClick = () => {
    inputRef.current.click();
  };
  const imageUpload = (event) => {
    const file = event.target.files[0];
    // blobの状態で送信
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result;
      fetch(`${config.apiUrl}/api/v1/gadget/upload`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64 }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          data.image_url ? setImageURL(data.image_url) : setImageURL(null);
          setGadgetData({ ...gadgetData, image_uuid: data.uuid });
        });
    };
  };

  useEffect(() => {
    rentalStatus.onClose();
    setImageURL("https://via.placeholder.com/1920x1080")
  }, [props.isOpen]);

  const createGadget = () => {
    props.onClose();
    gadgetData.rental_status = rentalStatus.isOpen;
    fetch(`${config.apiUrl}/api/v1/gadget/create`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gadgetData),
    });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ガジェットを追加</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={5}>
            <Image
              src={imageURL}
              borderRadius={30}
              width={"100%"}
              onClick={handleClick}
              _hover={{ 
                cursor: "pointer",
                filter: "brightness(0.8)"
            } }
            />
            <FormControl>
              <FormLabel>ガジェット名</FormLabel>
              <Input
                type="text"
                onChange={(e) => {
                  setGadgetData({ ...gadgetData, gadget_name: e.target.value });
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>ガジェット詳細</FormLabel>
              <Textarea
                onChange={(e) => {
                  setGadgetData({
                    ...gadgetData,
                    gadget_content: e.target.value,
                  });
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>タグ</FormLabel>
              <HStack>
                <Input
                  type="text"
                  onChange={(e) => {
                    setGadgetData({
                      ...gadgetData,
                      gadget_tag1: e.target.value,
                    });
                  }}
                />
                <Input
                  type="text"
                  onChange={(e) => {
                    setGadgetData({
                      ...gadgetData,
                      gadget_tag2: e.target.value,
                    });
                  }}
                />

                <Input
                  type="text"
                  onChange={(e) => {
                    setGadgetData({
                      ...gadgetData,
                      gadget_tag3: e.target.value,
                    });
                  }}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>レンタル</FormLabel>
              <HStack>
                <Switch
                  onChange={() => {
                    rentalStatus.onToggle();
                    console.log(rentalStatus.isOpen);
                    setGadgetData({
                      ...gadgetData,
                      rental_status: rentalStatus.isOpen,
                    });
                  }}
                />
                <FormLabel>
                  {rentalStatus.isOpen ? "レンタル可" : "レンタル不可"}
                </FormLabel>
              </HStack>
            </FormControl>
          </VStack>
          <input
            type="file"
            style={{ display: "none" }}
            ref={inputRef}
            onChange={imageUpload}
            accept="image/*"
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={createGadget}>
            送信
          </Button>
          <Button onClick={props.onClose}>閉じる</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function ShowDetailGadget(props) {
  const [gadget, setGadget] = useState({});
  const rentalModal = useDisclosure();
  const [userName, setUserName] = useState("");

  useLayoutEffect(() => {
    setGadget({});
    setUserName("Loading...");
    if (!props.isOpen) {
      return;
    }
    fetch(`${config.apiUrl}/api/v1/gadget/get/${props.gadgetId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setGadget(data);
        getUserName(data.user_id);
      });
  }, [props.isOpen]);
  const getUserName = (userId) => {
    fetch(`${config.apiUrl}/api/v1/user/whois/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserName(data.user_name);
      });
  };

  return (
    <>
      <Modal size={"2xl"} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent maxW={"760px"}>
          <ModalHeader>
            ガジェットの詳細
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Wrap>
              <WrapItem w={"300px"} margin={"auto"}>
                <Image
                  src={`${config.blobUrl}/main/${gadget.user_id}/gadgets/${props.gadgetId}`}
                  borderRadius={10}
                  htmlWidth={"100%"}
                />
              </WrapItem>
              <WrapItem w={"400px"}>
                <VStack align={"start"} pl={"20px"} spacing={4} w={"100%"}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {gadget.gadget_name}
                  </Text>
                  <HStack>
                    <Avatar
                      src={`${config.blobUrl}/main/${gadget.user_id}/icon`}
                      size={"sm"}
                    />
                    <Text>
                      {userName}
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    {gadget?.gadget_tag?.map((tag, index) => (
                      <Button key={index} size="sm" variant="outline">
                        {tag}
                      </Button>
                    ))}
                  </HStack>
                  <Text whiteSpace={"pre-wrap"}>{gadget.gadget_content}</Text>
                </VStack>
              </WrapItem>
            </Wrap>
          </ModalBody>
          <ModalFooter>
            <HStack>
              {console.log(gadget.is_renta)}
              {gadget.rental_status === 1 && (
                <Button
                  colorScheme="blue"
                  mr={4}
                  isDisabled={!gadget.is_rental}
                  onClick={() => {
                    rentalModal.onOpen();
                    props.onClose();
                  }}
                >
                  借りる
                </Button>
              )}
              <Button onClick={props.onClose}>閉じる</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <GadgetRental disclosure={rentalModal} gadgetId={props.gadgetId} />
    </>
  );
}

export function GadgetRental(props) {
  const [rentalData, setRentalData] = useState({
    rental_start: "",
    rental_end: "",
  });

  const rentalGadget = () => {
    fetch(`${config.apiUrl}/api/v1/gadget/createRental`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gadget_id: props.gadgetId,
        periods: rentalData.rental_end,
      }),
    });
  };

  return (
    <Modal isOpen={props.disclosure.isOpen} onClose={props.disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          ガジェットを借りる
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>いつまで</FormLabel>
            <HStack>
              {/* <Input
                type={"date"}
                onChange={(e) => {
                  setRentalData({
                    ...rentalData,
                    rental_start: e.target.value,
                  });
                }}
              />
              <Text>～</Text> */}
              <Input
                type={"date"}
                onChange={(e) => {
                  setRentalData({
                    ...rentalData,
                    rental_end: e.target.value,
                  });
                }}
              />
            </HStack>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={"blue"} onClick={rentalGadget}>
            確定
          </Button>
          <Button>閉じる</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
