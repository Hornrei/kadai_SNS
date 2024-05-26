import React from "react";

import { LeftIconBar } from "../components/LeftIconBar";
import { RightUserList } from "../components/RightUserList";
import Header  from "../components/Header";
import { PostModal } from "../components/PostModal";
import { Flex,useDisclosure } from "@chakra-ui/react";
import { Brand } from "../util/Theme";

function base() {
  const postModal  = useDisclosure();
  return (
    <>
    <Header />
    <PostModal isOpen={postModal.isOpen} onClose={postModal.onClosel} />
      <Flex
        backgroundColor={"green.50"}
        maxW={"1300px"}
        margin={"auto"}
        borderWidth={"1px"}
        borderTopRadius={"10px"}
      >
        {/* 左側 */}
        <LeftIconBar onOpen={postModal.onOpen} />
        {/* 中央 */}
        <Flex
          maxW={"1000px"}
          w={"100%"}
          wrap={"wrap"}
          justify={"space-between"}
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

        </Flex>
      </Flex>
    </>
  );
}

export default base;
