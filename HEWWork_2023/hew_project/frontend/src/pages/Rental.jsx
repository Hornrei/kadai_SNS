import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Center,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { PostModal } from "../components/PostModal.jsx";
import { LeftIconBar } from "../components/LeftIconBar.jsx";
import logo1 from "../assets/campection2.png";
import { SearchIcon } from "@chakra-ui/icons";
import { GadgetCard } from "../components/gatgets/GadgetCard.jsx";
import { ShowDetailGadget } from "../components/gatgets/GatgetModal.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { config } from "../config.js";
import { Brand } from "../util/Theme.js";

function Rental() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [gadgets, setGadgets] = useState([]);
  const openDetail = useDisclosure();
  const [clickGadgetID, setClickGadgetID] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  useEffect(() => {
  console.log(location.pathname+location.hash);
    
    fetch(`${config.apiUrl}/api/v1/gadget/get?rental_status=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setGadgets(data);
      });
  }, []);

  useEffect(() => {
    const path = location.hash.split("#/")[1];
    if (path) {
      setClickGadgetID(path);
      openDetail.onOpen();
    } else {
      openDetail.onClose();
    }

  }, [window.location.href]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!openDetail.isOpen) {
      navigate("/rental");
      openDetail.getButtonProps
    }
  }, [openDetail.isOpen]);
  return (
    <>
      <ShowDetailGadget
        isOpen={openDetail.isOpen}
        onClose={openDetail.onClose}
        gadgetId={clickGadgetID}
      />
      <PostModal isOpen={isOpen} onClose={onClose} />
      <Box backgroundColor={Brand["100.5"]}>
        <Center>
          <Image src={logo1} h={"70px"} />
        </Center>
      </Box>
      <Center h={"70px"}>
        <InputGroup w={"80vw"} maxW={"700px"} minW={"210px"} backgroundColor={Brand["white"]}>
          <Input placeholder="キーワード検索" />
          <InputRightElement>
            <SearchIcon />
          </InputRightElement>
        </InputGroup>
      </Center>
      <Flex
        backgroundColor={Brand["50"]}
        maxW={"1300px"}
        margin={"auto"}
        borderWidth={"1px"}
        borderTopRadius={"10px"}
      >
        {/* 左側 */}
        <LeftIconBar onOpen={onOpen} />
        {/* 中央 */}
        <Wrap
          maxW={"1000px"}
          w={"100%"}
          // justify={"space-between"}
          padding={"20px"}
          borderLeftWidth={"1px"}
          overflowY={"scroll"}
          h={"calc(100vh - 142px)"}
          scrollbar-color={Brand["100.5"]}
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
          {gadgets?.map((gadget) => {
            return (
              <WrapItem>
                <GadgetCard
                  gadgetTag={gadget.gadget_tag}
                  gadgetName={gadget.gadget_name}
                  gadgetImage={gadget.gadget_image}
                  gadgetID={gadget.gadget_id}
                  userID={gadget.user_id}
                  onClick={() => navigate(`/rental/#/${gadget.gadget_id}`)}
                />
              </WrapItem>
            );
          })}
        </Wrap>
      </Flex>
    </>
  );
}

export default Rental;
