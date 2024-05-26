import { SearchIcon } from "@chakra-ui/icons";

import {
  Box,
  Center,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import logo1 from "../assets/logo1.png";

import { LeftIconBar } from "../components/LeftIconBar";
import { PostCard } from "../components/PostCard.jsx";
import { PostModal, PostCommentModal } from "../components/PostModal.jsx";
import { RightUserList } from "../components/RightUserList";
import InfiniteScroll from "react-infinite-scroll-component";
import Header from "../components/Header.jsx";
import { useCookies } from "react-cookie";
import { config } from "../config.js";

import {Brand} from "../util/Theme.js";

function Index() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const commentDisc = useDisclosure();
  const [postContent, setPostContent] = useState([]);
  const [followPostContent, setFollowPostContent] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [hsaMoreFollow, setHasMoreFollow] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);

  useEffect(() => {
    fetch(`${config.apiUrl}/api/v1/auth/whoami`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCookie("user_id", data.user_id, { path: "/" });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
    getFolowingPost();
    getPost();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const getPost = () => {
    fetch(`${config.apiUrl}/api/v1/post/get/inIsFav?count=10&offset=0`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPostContent(data);
      });
  };
  const getFolowingPost = () => {
    fetch(`${config.apiUrl}/api/v1/post/followingPosts?count=10&offset=0`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ng") {
          setFollowPostContent([]);
          return;
        }
        setFollowPostContent(data);
      });
  };

  useEffect(() => {
    console.log(hsaMoreFollow)
  }, [hsaMoreFollow]);

  const fetchPosts = () => {
    fetch(
      `${config.apiUrl}/api/v1/post/get/inIsFav?count=10&offset=${postContent.length}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length == 0) {
          setHasMore(false);
        }
        setPostContent([...postContent, ...data]);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setHasMore(false);
      });
  };
  const fetchFollowPosts = () => {
    fetch(
      `${config.apiUrl}/api/v1/post/followingPosts?count=10&offset=${followPostContent.length}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.length);
        if (data.length == 0) {
          console.log("no more");
          setHasMoreFollow(false);
        }
        setFollowPostContent([...followPostContent, ...data]);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setHasMoreFollow(false);
      });
  };
  const favoriteHandler = () => {
    getPost();
    getFolowingPost();
  };

  const [handlePostID, setHandlePostID] = useState("");
  const commentHandler = (id) => {
    setHandlePostID(id);
    commentDisc.onOpen();
  };

  return (
    <>
      <PostModal isOpen={isOpen} onClose={onClose} />
      <PostCommentModal
        isOpen={commentDisc.isOpen}
        onClose={commentDisc.onClose}
        postID={handlePostID}
      />
      <Header />
      <Flex
        onKeyUp={(e) => {
          if (e.key === " " && e.ctrlKey) {
            console.log(e);
            onOpen();
          }
        }}
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
          <Tabs isFitted>
            <TabList h={"40px"} backgroundColor={Brand["50"]}>
              <Tab>おすすめ</Tab>
              <Tab>フォロー中</Tab>
            </TabList>
            <TabPanels>
              <TabPanel padding={"0"}>
                <Box
                  // scrollBehavior={"smooth"}
                  // ref={centerScrollRef}
                  overflowY={"scroll"}
                  h={"calc(100vh - 182px)"}
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
                  id="scrollPost"
                >
                  <InfiniteScroll
                    dataLength={postContent.length ? postContent.length : 10}
                    next={fetchPosts}
                    hasMore={hasMore}
                    loader={
                      <Center overflow={"hidden"} m={5}>
                        <Spinner />
                      </Center>
                    }
                    refreshFunction={getPost}
                    scrollableTarget="scrollPost"
                  >
                    {postContent?.map((post) => (
                      <PostCard
                        key={post.post_id + "all"}
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
                  </InfiniteScroll>
                </Box>
              </TabPanel>
              <TabPanel padding={"0"}>
                <Box
                  overflowY={"scroll"}
                  h={"calc(100vh - 182px)"}
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
                  id="scrollFollowPost"
                >
                  <InfiniteScroll
                    dataLength={
                      followPostContent.length ? followPostContent.length : 10
                    }
                    next={fetchFollowPosts}
                    hasMore={hsaMoreFollow}
                    loader={
                      <Center overflow={"hidden"} m={5}>
                        <Spinner />
                      </Center>
                    }
                    refreshFunction={getFolowingPost}
                    scrollableTarget="scrollFollowPost"
                  >
                    {followPostContent?.map((post) => (
                      <PostCard
                        key={post.post_id + "follow"}
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
                  </InfiniteScroll>
                  {/* フォローリスト */}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        {/* 右側 */}
        <RightUserList />
      </Flex>
    </>
  );
}

export default Index;
