import React, { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Avatar,
  Box,
  Flex,
  Text,
  Textarea,
  HStack,
  Icon,
  Button,
  Image,
  IconButton,
  Center,
} from "@chakra-ui/react";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { config } from "../config.js";

function PostModal(props) {
  const [postContent, setPostContent] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  const inputRef = useRef(null);
  const createPost = () => {
    fetch(`${config.apiUrl}/api/v1/post/create`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      body: JSON.stringify({
        content: postContent,
        image_uuid: imageURL ? imageURL.split("/").pop() : null,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    });
  };
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
      fetch(`${config.apiUrl}/api/v1/post/upload/image`, {
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
        });
    };
  };
  useEffect(() => {
    setImageURL(null);
    setPostContent("");
  }, [props.isOpen]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size={"2xl"}>
      <ModalOverlay />
      <ModalContent>
        <Box>
          <Flex
            borderBottomWidth={"1px"}
            margin={"15px"}
            paddingX={"20px"}
            paddingBottom={"10px"}
          >
            <Avatar
              marginRight={"15px"}
              size={"sm"}
              src={`${config.blobUrl}/main/${cookies.user_id}/icon`}
            />
            <Text margin={"auto 0"} fontSize={"xl"}>
              {cookies.user_id ? cookies.user_id : "ユーザー名"}
            </Text>
          </Flex>
          <Box marginTop={"20px"}>
            <Textarea
              placeholder="最高の瞬間をシェアしよう！"
              variant={"unstyled"}
              paddingX={"30px"}
              onChange={(e) => setPostContent(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter" && e.ctrlKey === true) {
                  createPost();
                  props.onClose();
                  window.location.reload();
                }
              }}
            />
            <Box>
              <Image
                width={"80%"}
                src={imageURL}
                margin={"auto"}
                borderRadius={"20px"}
              />
            </Box>
            <HStack paddingX={"20px"} marginTop={"5px"}>
              <IconButton
                variant={"ghost"}
                icon={<Icon as={InsertPhotoOutlinedIcon} />}
                onClick={() => handleClick()}
              />
              <IconButton
                variant={"ghost"}
                icon={<Icon as={MovieCreationOutlinedIcon} />}
              />
            </HStack>
            <Box textAlign={"right"}>
              <IconButton
                variant={"ghost"}
                icon={<Icon as={AddOutlinedIcon} fontSize={"5xl"} />}
                margin={"5px"}
                onClick={() => {
                  createPost();
                  props.onClose();
                  // reloadを1秒後に
                }}
              />
              <input
                type="file"
                style={{ display: "none" }}
                ref={inputRef}
                onChange={imageUpload}
              />
            </Box>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}

function PostCommentModal(props) {
  const [postContent, setPostContent] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  const inputRef = useRef(null);
  const createPost = () => {
    fetch(`${config.apiUrl}/api/v1/post/comment`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      body: JSON.stringify({
        content: postContent,
        image_url: imageURL,
        postID: props.postID,
      }),
    });
  };
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
      fetch(`${config.apiUrl}/api/v1/post/upload/image`, {
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
        });
    };
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size={"2xl"}>
      <ModalOverlay />
      <ModalContent>
        <Box>
          <Flex
            borderBottomWidth={"1px"}
            margin={"15px"}
            paddingX={"20px"}
            paddingBottom={"10px"}
          >
            <Avatar
              marginRight={"15px"}
              size={"sm"}
              src={`${config.blobUrl}/main/${cookies.user_id}/icon`}
            />
            <Text margin={"auto 0"} fontSize={"xl"}>
              {cookies.user_id ? cookies.user_id : "ユーザー名"}
            </Text>
          </Flex>
          <Box marginTop={"20px"}>
            <Textarea
              placeholder="コメントを追加しよう！"
              variant={"unstyled"}
              paddingX={"30px"}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <Box>
              <Image
                width={"80%"}
                src={imageURL}
                margin={"auto"}
                borderRadius={"20px"}
              />
            </Box>
            <HStack paddingX={"20px"} marginTop={"5px"}>
              <IconButton
                variant={"ghost"}
                icon={<Icon as={InsertPhotoOutlinedIcon} />}
                onClick={() => handleClick()}
              />
              <IconButton
                variant={"ghost"}
                icon={<Icon as={MovieCreationOutlinedIcon} />}
              />
            </HStack>
            <Box textAlign={"right"}>
              <IconButton
                variant={"ghost"}
                icon={<Icon as={AddOutlinedIcon} fontSize={"5xl"} />}
                margin={"5px"}
                onClick={() => {
                  createPost();
                  props.onClose();
                  props.callback();
                }}
              />
              <input
                type="file"
                style={{ display: "none" }}
                ref={inputRef}
                onChange={imageUpload}
              />
            </Box>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}

export { PostModal, PostCommentModal };
