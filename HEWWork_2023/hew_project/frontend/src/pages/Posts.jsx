import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { PostModal, PostCommentModal } from "../components/PostModal.jsx";

import { LeftIconBar } from "../components/LeftIconBar";
import { RightUserList } from "../components/RightUserList";
import { PostCard2, PostCard } from "../components/PostCard.jsx";

import Header from "../components/Header.jsx";
import { Box } from "@chakra-ui/react";
import { config } from "../config.js";
import { Brand } from "../util/Theme.js";

function Posts() {
  const { postID } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const commentDisc = useDisclosure();
  const [postData, setPostData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [handlePostID, setHandlePostID] = useState("");

  const commentHandler = (id) => {
    console.log(id);
    setHandlePostID(id);
    commentDisc.onOpen();
  };

  useEffect(() => {
    getPost();
    getPostComment();
  }, [window.location.pathname, commentDisc.isOpen]);

  const getPost = () => {
    fetch(`${config.apiUrl}/api/v1/post/get/${postID}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPostData(data);
      });
  };

  const getPostComment = () => {
    fetch(`${config.apiUrl}/api/v1/post/get/${postID}/comment`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCommentData(data);
      });
  };
  const favoriteHandler = (id, isFav) => {
    if (isFav) {
      unfavoritePost(id);
    } else {
      favoritePost(id);
    }
  };
  const favoritePost = (id) => {
    console.log(id);
    fetch(`${config.apiUrl}/api/v1/post/favorite`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        post_id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ng") {
          return;
        }
        getPost();
        getPostComment();
      });
  };
  const unfavoritePost = (id) => {
    fetch(`${config.apiUrl}/api/v1/post/unfavorite`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        post_id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ng") {
          return;
        }
        getPost();
        getPostComment();
      });
  };

  return (
    <>
      <PostCommentModal
        isOpen={commentDisc.isOpen}
        onClose={commentDisc.onClose}
        postID={handlePostID}
      />

      <PostModal isOpen={isOpen} onClose={onClose} />
      <Header />

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
          // scrollBehavior={"smooth"}
          // ref={centerScrollRef}
          w={"700px"}
          minW={{ base: "0", md: "700px" }}
          borderLeftWidth={"1px"}
          borderRightWidth={"1px"}
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
          <PostCard2
            key={postData.post_id}
            postID={postData.post_id}
            userID={postData.user_id}
            userName={postData.user_name}
            postText={postData.content}
            postImageSrc={postData.image_url}
            avatarSrc={postData.icon_url}
            onFavClick={favoriteHandler}
            isFav={postData.is_favorite}
            onCommentClick={commentHandler}
          />
          {commentData?.map((comment) => (
            <PostCard
              key={comment.comment_id}
              postID={comment.comment_id}
              userID={comment.user_id}
              userName={comment.user_name}
              postText={comment.content}
              avatarSrc={comment.icon_url}
              onFavClick={favoriteHandler}
              isFav={comment.is_favorite}
              onCommentClick={commentHandler}
            />
          ))}
        </Box>

        {/* 右側 */}
        <RightUserList />
      </Flex>
    </>
  );
}

export default Posts;
