import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Container,
  Flex,
  Stack,
  Button,
  Icon,
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
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import logo1 from "../assets/logo1.png";
import { useCookies } from "react-cookie";
import { useParams,useSearchParams } from "react-router-dom"

import { SmallUserBox } from "../components/UserBox.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { PostModal } from "../components/PostModal.jsx";
import { UserCard } from "../components/UserCard";
import { LeftIconBar } from "../components/LeftIconBar";
import { RightUserList } from "../components/RightUserList";
import { PostCommentModal } from "../components/PostModal.jsx";
import { config } from "../config.js";
import Header from "../components/Header.jsx";
import { Brand } from "../util/Theme.js";


function Search() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postContent, setPostContent] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  const commentDisc = useDisclosure();
  const [handlePostID, setHandlePostID] = useState("");
  // q=検索キーワード
  const [q]  = useSearchParams();

  const favoriteHandler = () =>{
    reloadPost()
  }
  useEffect(() => {
    reloadPost()
  } , [q]);

  const reloadPost = () => {
    console.log("reload")
    fetch(`${config.apiUrl}/api/v1/post/search?keyword=${q.get("q")}`, {method:"GET",mode: 'cors', credentials: 'include'})
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setPostContent(data.data)
    })}
    const commentHandler = (id) => {
      setHandlePostID(id);
      commentDisc.onOpen();
    };

  return (
    <>
    <PostCommentModal
        isOpen={commentDisc.isOpen}
        onClose={commentDisc.onClose}
        postID={handlePostID}
      />
    <PostCommentModal/>
      <PostModal isOpen={isOpen} onClose={onClose} callback={reloadPost}/>
      <Header keyword={q.get("q")} />
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
        <Box
          w={"700px"}
          minW={{ base: "0", md: "700px" }}
          borderLeftWidth={"1px"}
          borderRightWidth={"1px"}
        >
          <Box
            // scrollBehavior={"smooth"}
            // ref={centerScrollRef}
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
            {postContent?.map((post) => (
              <PostCard
              key={post.post_id}
              postID={post.post_id}
              userID={post.user_id}
              userName={post.user_name}
              postText={post.content}
              postImageSrc={post.image_url}
              avatarSrc={post.icon_url}
              isFav={post.is_favorite}
              onFavClick={favoriteHandler}
              onCommentClick={commentHandler}
              />
            ))}
            {postContent === null && (
              <Center>
                <Spinner />
              </Center>
            )}
          </Box>
        </Box>
        {/* 右側 */}
        <RightUserList />
      </Flex>
    </>
  );
}

export default Search;
