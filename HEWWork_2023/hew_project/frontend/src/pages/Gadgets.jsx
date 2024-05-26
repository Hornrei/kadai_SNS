import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { LeftIconBar } from "../components/LeftIconBar";
import { PostModal } from "../components/PostModal";
import { RightUserList } from "../components/RightUserList";

import { useParams } from "react-router-dom";

import { GadgetCard } from "../components/gatgets/GadgetCard";

import {
  AddNewGadget,
  ShowDetailGadget,
} from "../components/gatgets/GatgetModal";
import { config } from "../config";
import { Brand } from "../util/Theme";

function Gadgets() {
  const addGadgetModal = useDisclosure();
  const openDetail = useDisclosure();
  const { userID } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  const [gadgets, setGadgets] = useState(null);
  const [clickGadgetID, setClickGadgetID] = useState("");

  useEffect(() => {
    fetch(`${config.apiUrl}/api/v1/gadget/get?filter=${userID.split("@")[1]}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status == "ng") {
          return;
        }
        setGadgets(data);
      });
  }, []);


  return (
    <>
      <ShowDetailGadget
        isOpen={openDetail.isOpen}
        onClose={openDetail.onClose}
        gadgetId={clickGadgetID}
      />
      <Header />
      <PostModal />
      <AddNewGadget
        isOpen={addGadgetModal.isOpen}
        onClose={addGadgetModal.onClose}
      />
      <Flex
        backgroundColor={Brand["50"]}
        maxW={"1300px"}
        margin={"auto"}
        borderWidth={"1px"}
        borderTopRadius={"10px"}
      >
        {/* 左側 */}
        <LeftIconBar />
        {/* 中央 */}
        <Box
          pos={"relative"}
          maxW={"1000px"}
          w={"100%"}
          wrap={"wrap"}
          justify={"space-between"}
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
          <HStack
            w={"100%"}
            spacing={5}
            alignItems={"start"}
            p={2}
            pos={"sticky"}
            top={0}
            zIndex={100}
            borderBottomWidth={1}
          >
            <Avatar
              size={"md"}
              src={`${config.blobUrl}/main/${userID.split("@")[1]}/icon`}
            />
            <Heading size={"lg"}>{userID}</Heading>
          </HStack>
          <Box w={"100%"} >
            <Accordion allowToggle allowMultiple defaultIndex={[1]}>
              <AccordionItem >
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    レンタルできるガジェット
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Wrap
                  // justify={"space-between"}
                  >
                    {gadgets?.map((data) => {
                      if (data.rental_status == 0){
                        return
                      }
                      return (
                        <WrapItem key={data.gadget_id}>
                          <GadgetCard
                            gadgetTag={data.gadget_tag}
                            gadgetName={data.gadget_name}
                            gadgetID={data.gadget_id}
                            userID={data.user_id}
                            
                            
                            onClick={() => {
                              openDetail.onOpen();
                              setClickGadgetID(data.gadget_id);
                            }}
                          />
                        </WrapItem>
                      );
                    })}
                  </Wrap>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    すべてのガジェット
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Wrap
                  // justify={"space-between"}
                  >
                    {console.log(gadgets)}
                    {gadgets?.map((data) => {
                      return (
                        <WrapItem key={data.gadget_id}>
                          <GadgetCard
                            gadgetTag={data.gadget_tag}
                            gadgetName={data.gadget_name}
                            gadgetID={data.gadget_id}
                            userID={data.user_id}
                            
                            onClick={() => {
                              openDetail.onOpen();
                              setClickGadgetID(data.gadget_id);
                            }}
                          />
                        </WrapItem>
                      );
                    })}
                    {cookies.user_id == userID.split("@")[1] && (
                      <Center w={"100%"}>
                        <Button
                          colorScheme={"green"}
                          onClick={addGadgetModal.onOpen}
                        >
                          新しいガジェットを登録
                        </Button>
                      </Center>
                    )}
                  </Wrap>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default Gadgets;
