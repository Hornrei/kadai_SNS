import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  Modal,
  ModalOverlay,
  CloseButton,
  ModalContent,
  useDisclosure,
  HStack,
  Spacer,
  IconButton,
  Icon,
  Link,
  Button,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { ConvertText } from "./util/ConvertText.jsx";

/**
 * PostCard コンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.userID - ユーザーのID
 * @param {string} props.avatarSrc - アバター画像のURL
 * @param {string} props.userName - ユーザー名
 * @param {string} props.postID - 投稿のID
 * @param {string} props.postText - 投稿のテキスト
 * @param {string|null} props.postImageSrc - 投稿画像のURL
 * @param {boolean} props.isFav - お気に入り登録されているかどうか
 * @param {function} props.onFavClick - お気に入り登録のハンドラ
 * @param {function} props.onCommentClick - コメントのハンドラ
 */

import { favoriteHandler } from "../util/FavoritePost.js";

function PostCard(props) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFav, setIsFav] = useState(props.isFav);

  return (
    <Box
      padding={"10px"}
      margin={"5px"}
      borderBottomWidth={"1px"}
      marginBottom={"15px"}
      
    >
      <Flex
        marginBottom={"10px"}
        cursor={"pointer"}
        onClick={() => navigate(`/@${props.userID}`)}
      >
        <Avatar
          size={"sm"}
          src={`${config.blobUrl}/main/${props.userID}/icon`}
        />
        <Text fontSize={"lg"} fontWeight={"bold"} margin={"auto 10px"}>
          {props.userName ? props.userName : "ユーザー名"}
        </Text>
      </Flex>
      <Box
        padding={"10px"}
        marginBottom={"10px"}
        cursor={"pointer"}
        onClick={() => navigate(`/posts/${props.postID}`)}
      >
        <Text whiteSpace={"pre-wrap"}>
          {props.postText ? props.postText : ""}
        </Text>
      </Box>
      {props.postImageSrc ? (
        <Box marginBottom={"20px"}>
          <Image
            src={props.postImageSrc}
            width={"700px"}
            height={"400px"}
            objectFit={"cover"}
            cursor={"pointer"}
            borderRadius={"50px"}
            onClick={onOpen}
          />
        </Box>
      ) : (
        <></>
      )}{" "}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW={"95vw"} maxH={"100vh"}>
          <Box>
            <CloseButton pos={"absolute"} onClick={onClose} color={"white"} />
            <Image
              src={props.postImageSrc}
              htmlHeight={"100%"}
              htmlWidth={"100%"}
            />
          </Box>
        </ModalContent>
      </Modal>
      <Flex>
        <Spacer />
        <IconButton
          size={"sm"}
          icon={
            <Icon
              as={isFav ? FavoriteIcon : FavoriteBorderOutlinedIcon}
              color={isFav ? "red.400" : "black"}
              _active={{ transform: "scale(0.9)" }}
            />
          }
          variant={"ghost"}
          // onClick={() => props.onFavClick(props.postID, props.isFav)}
          onClick={() => {
            favoriteHandler(props.postID, isFav);
            setIsFav(!isFav);
            // props.onFavClick();
          }}
        />
        <Spacer />
        <IconButton
          size={"sm"}
          icon={<Icon as={CommentIcon} />}
          variant={"ghost"}
          onClick={() => props.onCommentClick(props.postID)}
        />
        <Spacer />
        <IconButton
          size={"sm"}
          icon={<Icon as={ShareIcon} />}
          variant={"ghost"}
          onClick={async () => navigator.share({ url: `https://${config.origin}/posts/${props.postID}` })}
        />
        <Spacer />
      </Flex>
    </Box>
  );
}

import { config } from "../config.js";
import { UserListModal } from "./UserListModal.jsx";

/**
 * PostCard2 詳細表示用の投稿カード
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.userID - ユーザーのID
 * @param {string} props.avatarSrc - アバター画像のURL
 * @param {string} props.userName - ユーザー名
 * @param {string} props.postID - 投稿のID
 * @param {string} props.postText - 投稿のテキスト
 * @param {string|null} props.postImageSrc - 投稿画像のURL
 */
function PostCard2(props) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [favCount, setFavCount] = useState(null);

  const favModal = useDisclosure();

  useEffect(() => {
    fetch(`${config.apiUrl}/api/v1/post/${props.postID}/favorite/count`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFavCount(data.count);
      });
  }, [props.isFav]);

  return (
    <Box
      padding={"15px"}
      margin={"5px"}
      borderBottomWidth={"1px"}
      marginBottom={"15px"}
    >
      <HStack
        marginBottom={"10px"}
        cursor={"pointer"}
        onClick={() => navigate(`/@${props.userID}`)}
      >
        <Avatar
          size={"md"}
          src={`${config.blobUrl}/main/${props.userID}/icon`}
        />
        <Box>
          <Text fontSize={"xl"} fontWeight={"bold"}>
            {props.userName ? props.userName : "loading..."}
          </Text>
          <Text fontSize={"xs"}>
            {props.userID ? `@${props.userID}` : "loading..."}
          </Text>
        </Box>
      </HStack>
      <Box padding={"10px"} marginBottom={"10px"}>
        <SkeletonText  isLoaded={props.postText != null}>
          <ConvertText text={props.postText} />
        </SkeletonText>
      </Box>
      {props.postImageSrc ? (
        <Box marginBottom={"20px"}>
          <Image
            src={props.postImageSrc}
            width={"700px"}
            height={"400px"}
            objectFit={"cover"}
            cursor={"pointer"}
            borderRadius={"50px"}
            onClick={onOpen}
            crossOrigin="anonymous"
          />
        </Box>
      ) : (
        <></>
      )}{" "}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW={"80%"}>
          <CloseButton pos={"absolute"} onClick={onClose} />
          <Image src={props.postImageSrc} />
        </ModalContent>
      </Modal>
      <UserListModal
        listType="いいね"
        isOpen={favModal.isOpen}
        onClose={favModal.onClose}
        extendValue={props.postID}
      />
      <Flex>
        <Spacer />
        <Skeleton isLoaded={favCount != null}>
          <HStack>
            <IconButton
              size={"sm"}
              icon={
                <Icon
                  as={props.isFav ? FavoriteIcon : FavoriteBorderOutlinedIcon}
                  color={props.isFav ? "red.400" : "black"}
                  _active={{ transform: "scale(0.9)" }}
                />
              }
              onClick={() => props.onFavClick(props.postID, props.isFav)}
              variant={"ghost"}
            />

            <Button variant={"link"} color={"black"} onClick={favModal.onOpen}>
              {favCount}
            </Button>
          </HStack>
        </Skeleton>
        <Spacer />
        <IconButton
          size={"sm"}
          icon={<Icon as={CommentIcon} />}
          variant={"ghost"}
          onClick={() => props.onCommentClick(props.postID)}
        />
        <Spacer />
        <IconButton
          size={"sm"}
          icon={<Icon as={ShareIcon} />}
          variant={"ghost"}
          onClick={async () => navigator.share({ url: `https://${config.origin}/posts/${props.postID}` })}
        />
        <Spacer />
      </Flex>
    </Box>
  );
}

function PostCommentCard() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      padding={"10px"}
      margin={"5px"}
      borderBottomWidth={"1px"}
      marginBottom={"15px"}
    >
      <Flex
        marginBottom={"10px"}
        cursor={"pointer"}
        onClick={() => navigate(`/@${props.userID}`)}
      >
        <Avatar
          size={"sm"}
          src={`${config.blobUrl}/main/${props.userID}/icon`}
        />
        <Text fontSize={"lg"} fontWeight={"bold"} margin={"auto 10px"}>
          {props.userName ? props.userName : "ユーザー名"}
        </Text>
      </Flex>
      <Box
        padding={"10px"}
        marginBottom={"10px"}
        cursor={"pointer"}
        onClick={() => navigate(`/posts/${props.postID}`)}
      >
        <Text whiteSpace={"pre-wrap"}>
          {props.postText ? props.postText : ""}
        </Text>
      </Box>
      {props.postImageSrc ? (
        <Box marginBottom={"20px"}>
          <Image
            src={props.postImageSrc}
            width={"700px"}
            height={"400px"}
            objectFit={"cover"}
            cursor={"pointer"}
            borderRadius={"50px"}
            onClick={onOpen}
          />
        </Box>
      ) : (
        <></>
      )}{" "}
      <Modal size={"full"} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW={"80%"} maxH={"80%"}>
          <CloseButton pos={"absolute"} onClick={onClose} />
          <Image src={props.postImageSrc} h={"100%"} />
        </ModalContent>
      </Modal>
      <Flex>
        <Spacer />
        <IconButton
          size={"sm"}
          icon={
            <Icon
              as={props.isFav ? FavoriteIcon : FavoriteBorderOutlinedIcon}
              color={props.isFav ? "red.400" : "black"}
              _active={{ transform: "scale(0.9)" }}
            />
          }
          variant={"ghost"}
          // onClick={() => props.onFavClick(props.postID, props.isFav)}
          onClick={() => {
            favoriteHandler(props.postID, props.isFav);
            props.onFavClick();
          }}
        />
        <Spacer />
        <IconButton
          size={"sm"}
          icon={<Icon as={CommentIcon} />}
          variant={"ghost"}
          onClick={() => props.onCommentClick(props.postID)}
        />
        <Spacer />
        <IconButton
          size={"sm"}
          icon={<Icon as={ShareIcon} />}
          variant={"ghost"}
          onClick={async () => navigator.share({ url: `https://${config.origin}/posts/${props.postID}` })}
        />
        <Spacer />
      </Flex>
    </Box>
  );
}

export { PostCard, PostCard2 };
