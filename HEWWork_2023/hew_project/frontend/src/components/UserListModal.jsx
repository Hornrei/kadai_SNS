import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Box,
  Avatar,
  Flex,
  Heading,
  Text,
  HStack,
  Center,
  Icon,
  Button,
  Spacer,
  IconButton,
  useDisclosure,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Skeleton,
} from "@chakra-ui/react";
import { useParams,useNavigate } from "react-router-dom";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { UserProfileModal } from "./UserProfileModal.jsx";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";

import { useCookies } from "react-cookie";
import { SmallUserBox } from "./UserBox.jsx";
import { config } from "../config.js";
export function UserListBox(props) {
  return (
    <HStack w={"100%"} onClick={() => {props.UserClick(props.userID)}}>
      <Avatar size={"md"} src={`${config.blobUrl}/main/${props.userID}/icon`} />
      <VStack textAlign={"left"} alignItems={"flex-start"} spacing={0}>
        <Heading as="h2" size="md">
          {props.userName}
        </Heading>
        <Text fontSize={"2xs"}>@{props.userID}</Text>
      </VStack>
      <Spacer />
      <Button size={"sm"} isDisabled>
        フォロー
      </Button>
    </HStack>
  );
}
export function UserListModal(props) {
  const [userList, setUserList] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  const navigate = useNavigate();

  const UserClickHandle = (id) =>{
    console.log(id);
    props.onClose();
    navigate(`/@${id}`)
  }

  const getUserFollowing = () => {
    fetch(
      `${config.apiUrl}/api/v1/user/following?userID=${props.user_id}&count=10&offset=0`,
      {
        method: "GET",
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUserList(data.users);
        console.log(data.users);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const getUserFollower = () => {
    fetch(
      `${config.apiUrl}/api/v1/user/follower?userID=${props.user_id}&count=10&offset=0`,
      {
        method: "GET",
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUserList(data.users);
        console.log(data.users);
      });
  };

  const getUserFavorite = () => {
    fetch(
      `${config.apiUrl}/api/v1/post/favoriteList?post_id=${props.extendValue}`,
      {
        method: "GET",
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUserList(data.list);
      });
  }

  useLayoutEffect(() => {
    setUserList(null);
    if (props.listType === "フォロー") {
      getUserFollowing();
    } else if (props.listType === "フォロワー") {
      getUserFollower();
    }else if (props.listType === "いいね") {
      getUserFavorite();
    }
  }, [props.isOpen]);


  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>{props.listType}</ModalHeader>
        <ModalBody>
          <VStack spacing={5}>
            {userList?.map((user) => {
              return <UserListBox userID={user.user_id} userName={user.user_name} UserClick={UserClickHandle}/>;
            })}
            {userList?.length === 0 ? <Center h={"65px"}>
              <Text>ユーザーがいません</Text>
            </Center> : ""}
            {userList === null &&(
              <Skeleton w={"100%"}>
                <UserListBox userID={""} userName={""} UserClick={UserClickHandle}/>
              </Skeleton>
            )}

          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
