import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  HStack,
  Hide,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Show,
  Spacer,
  Stack,
  useDisclosure,
  createIcon,
  Img,
  IconButton,
  Heading,
  VStack,
  ModalCloseButton,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ForumIcon from "@mui/icons-material/Forum";
// import HomeIcon from "@mui/icons-material/Home";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import { useCookies } from "react-cookie";
import { PostModal } from "./PostModal";
import { config } from "../config";
import { Brand } from "../util/Theme";
// # svgType1
import HomeIcon from "../assets/HomeIcon1.svg?react";
import HomeOutlinedIcon from "../assets/outline-plus.svg?react";
import { BellIcon } from "@chakra-ui/icons";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
// # svgType2
// import HomeIcon  from "../assets/HomeIcon2.svg?react"
// import HomeOutlinedIcon from "../assets/HomeIconOutline2.svg?react"

// const HomeIcon = createIcon({
//   displayName: "HomeIconRe",
//   viewBox: "0 0 496.5 441.01",
//   d: "M76.53 440.9H0c1.36-2.16 2.28-3.66 3.23-5.14C81.46 313.7 159.67 191.63 238 69.64c2.23-3.48 2.11-5.75-.12-9.08-11.09-16.58-21.94-33.33-32.77-50.09-.85-1.31-3.39-2.76-1.48-4.54 2.38-2.23 4.56-5.09 7.85-5.89 1.48-.36 1.98 1.98 2.75 3.17 11.21 17.3 22.36 34.64 33.96 52.66 11.65-18.82 23.05-37.22 34.44-55.61.45.16.76.19.96.35q8.24 6.49 2.69 15.34c-9.44 15.08-18.79 30.21-28.37 45.19-1.79 2.79-1.76 4.66.03 7.46 73.25 114.19 146.41 228.43 219.58 342.68 6.15 9.6 12.3 19.21 18.97 29.62h-5.12c-56.32 0-112.64-.06-168.96.11-4.27.01-5.06-1.15-5.04-5.19.17-38.49.05-76.98.18-115.47.01-3.61-.68-4.73-4.55-4.72-43.16.16-86.31.16-129.47 0-3.86-.01-4.59 1.08-4.58 4.71.14 38.49.01 76.98.19 115.47.02 4.13-.92 5.21-5.13 5.19-32.33-.2-64.65-.11-97.48-.11z",
// });

// const HomeIcons = createIcon({
//   displayName: "HomeIcon",
//   path: (<HomeIconRe />)
// });

function LeftIconBar(porps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  const postModal = useDisclosure();
  const userStateModal = useDisclosure();

  const notificationModal = useDisclosure();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([]);
    fetch(`${config.notifyUrl}/api/notice/get?user_id=${cookies.user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.data.all);
      });
  }, [window.location, notificationModal.isOpen]);

  return (
    <>
      <NotificationsModal
        disclosure={notificationModal}
        notifications={notifications}
      />
      <UserStateModal disclosure={userStateModal} />
      <PostModal isOpen={postModal.isOpen} onClose={postModal.onClose} />
      <Show above="1200px">
        <Box maxW={"300px"} w={"300px"} backgroundColor={Brand["50"]}>
          <Stack w={"200px"} margin={"20px auto"} spacing={4}>
            <Button
              leftIcon={
                <Icon
                  as={location.pathname != "/" ? HomeOutlinedIcon : HomeIcon}
                  fontSize={"3xl"}
                />
              }
              variant={"ghost"}
              justifyContent={"flex-start"}
              fontSize={"lg"}
              size={"lg"}
              onClick={() => navigate(`/`)}
            >
              ホーム
            </Button>
            <Button
              leftIcon={
                <Icon
                  as={
                    location.pathname != `/@${cookies.user_id}`
                      ? AccountCircleOutlinedIcon
                      : AccountCircleIcon
                  }
                  fontSize={"3xl"}
                />
              }
              variant={"ghost"}
              justifyContent={"flex-start"}
              fontSize={"lg"}
              size={"lg"}
              onClick={() => navigate(`/@${cookies.user_id}`)}
            >
              プロフィール
            </Button>
            <Button
              leftIcon={<Icon as={AddBoxOutlinedIcon} fontSize={"3xl"} />}
              variant={"ghost"}
              justifyContent={"flex-start"}
              fontSize={"lg"}
              size={"lg"}
              onClick={postModal.onOpen}
            >
              投稿
            </Button>
            <Button
              leftIcon={
                <Icon
                  as={
                    location.pathname != "/rental"
                      ? SwapHorizontalCircleOutlinedIcon
                      : SwapHorizontalCircleIcon
                  }
                  fontSize={"3xl"}
                />
              }
              variant={"ghost"}
              justifyContent={"flex-start"}
              fontSize={"lg"}
              size={"lg"}
              onClick={() => navigate(`/rental`)}
            >
              貸出
            </Button>
            <Button
              leftIcon={
                <Icon
                  as={
                    location.pathname != "/Calendar"
                      ? CalendarMonthOutlinedIcon
                      : CalendarMonth
                  }
                  fontSize={"3xl"}
                />
              }
              variant={"ghost"}
              justifyContent={"flex-start"}
              fontSize={"lg"}
              size={"lg"}
              onClick={() => navigate(`/Calendar`)}
            >
              カレンダー
            </Button>
            <Button
              leftIcon={
                <Icon
                  as={
                    location.pathname != "/Dm" ? ForumOutlinedIcon : ForumIcon
                  }
                  fontSize={"3xl"}
                />
              }
              variant={"ghost"}
              justifyContent={"flex-start"}
              fontSize={"lg"}
              size={"lg"}
              onClick={() => navigate(`/Dm`)}
            >
              チャット
            </Button>
            <Button
              leftIcon={
                <Icon as={
                  notifications.length > 0
                    ? NotificationsActiveIcon
                    : NotificationsNoneOutlinedIcon
                } fontSize={"3xl"} />
              }
              variant={"ghost"}
              justifyContent={"flex-start"}
              fontSize={"lg"}
              size={"lg"}
              onClick={notificationModal.onOpen}
            >
              通知
            </Button>
          </Stack>
        </Box>
      </Show>
      <Hide above="1200px">
        <Box w={"50px"} borderRightWidth={"1px"} backgroundColor={Brand["50"]}>
          <Stack w={"50px"} margin={"20px auto"} spacing={4}>
            <IconButton
              variant={"ghost"}
              size={"lg"}
              icon={
                <Icon
                  as={location.pathname != "/" ? HomeOutlinedIcon : HomeIcon}
                  fontSize={"3xl"}
                />
              }
              onClick={() => navigate(`/`)}
            />
            <IconButton
              variant={"ghost"}
              size={"lg"}
              icon={
                <Icon
                  as={
                    location.pathname != `/@${cookies.user_id}`
                      ? AccountCircleOutlinedIcon
                      : AccountCircleIcon
                  }
                  fontSize={"3xl"}
                />
              }
              onClick={() => navigate(`/@${cookies.user_id}`)}
            />
            <IconButton
              variant={"ghost"}
              size={"lg"}
              icon={<Icon as={AddBoxOutlinedIcon} fontSize={"3xl"} />}
              onClick={postModal.onOpen}
            />
            <IconButton
              variant={"ghost"}
              size={"lg"}
              icon={
                <Icon
                  as={
                    location.pathname != "/rental"
                      ? SwapHorizontalCircleOutlinedIcon
                      : SwapHorizontalCircleIcon
                  }
                  fontSize={"3xl"}
                />
              }
              onClick={() => navigate("/rental")}
            />
            <IconButton
              variant={"ghost"}
              size={"lg"}
              icon={
                <Icon
                  as={
                    location.pathname != "/Calendar"
                      ? CalendarMonthOutlinedIcon
                      : CalendarMonth
                  }
                  fontSize={"3xl"}
                />
              }
              onClick={() => navigate("/Calendar")}
            />
            <IconButton
              variant={"ghost"}
              size={"lg"}
              icon={
                <Icon
                  as={
                    location.pathname != "/Dm" ? ForumOutlinedIcon : ForumIcon
                  }
                  fontSize={"3xl"}
                />
              }
              onClick={() => navigate("/dm")}
            />
              <IconButton
                variant={"ghost"}
                size={"lg"}
                icon={
                  <Icon as={
                    notifications.length > 0
                      ? NotificationsActiveIcon
                      : NotificationsNoneOutlinedIcon
                  } fontSize={"3xl"} />
                }
                onClick={notificationModal.onOpen}
              />
            <IconButton
              variant={"ghost"}
              icon={
                <Avatar
                  size={"sm"}
                  src={`${config.blobUrl}/main/${cookies.user_id}/icon`}
                />
              }
              onClick={userStateModal.onOpen}
            />
          </Stack>
        </Box>
      </Hide>
    </>
  );
}
function UserStateModal(props) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  return (
    <Modal onClose={props.disclosure.onClose} isOpen={props.disclosure.isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <HStack>
            <Button
              size={"lg"}
              w={"100%"}
              onClick={() => navigate(cookies.user_id ? "/logout" : "/login")}
            >
              {cookies.user_id ? "ログアウト" : "ログイン/新規登録"}
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function NotificationsModal(props) {
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);

  return (
    <Modal onClose={props.disclosure.onClose} isOpen={props.disclosure.isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          通知
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <VStack>
            {props.notifications?.map((notification) => (
              <NotificationsContent
                type={notification.type}
                content={notification.content}
                key={Math.random()}
                userId={cookies.user_id}
              />
            ))}
            {props.notifications.length == 0 && <Text>通知はありません</Text>}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button
              onClick={() => {
                fetch(`${config.notifyUrl}/api/notice/deleteUser`, {
                  method: "POST",
                  body: JSON.stringify({ user_id: cookies.user_id }),
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                setNotifications([]);
              }}
            >
              すべて削除
            </Button>
            <Button onClick={props.disclosure.onClose}>閉じる</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function NotificationsContent(props) {
  const navigate = useNavigate();
  const TypeText = () => {
    switch (props.type) {
      case "dm":
        return "DMが来ています";
      case "comment":
        return "コメントされました";
      case "follow":
        return "フォローされました";
      case "favorite":
        return "いいねされました";
      default:
        return "通知";
    }
  };
  const TypeLink = () => {
    switch (props.type) {
      case "dm":
        return `/dm/${props.content}`;
      case "comment":
        return `/posts/${props.content}`;
      case "follow":
        return `/@${props.content}`;
      case "favorite":
        return `/posts/${props.content}`;
      default:
        return "";
    }
  };

  const  delNotification = async () => {
    fetch(`${config.notifyUrl}/api/notice/delete`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        type: props.type,
        content: props.content,
        target: props.userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  return (
    <Box
      borderWidth={1}
      padding={2}
      w={"100%"}
      borderRadius={10}
      backgroundColor={"blackAlpha.100"}
      id={props.content}
    >
      <HStack>
        <Button
          variant={"link"}
          color={"black"}
          onClick={() => {
            delNotification().then(() => {
              navigate(TypeLink());
            });
          }}
        >
          {TypeText()}
        </Button>
        <Spacer />
        <Button
          variant={"solid"}
          color={"black"}
          onClick={() => {
            delNotification();
            // id = {props.key}を非表示
            document.getElementById(props.content).style.display = "none";
          }}
        >
          削除
        </Button>
      </HStack>
    </Box>
  );
}

export { LeftIconBar };
