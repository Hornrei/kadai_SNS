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
  Show,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { UserProfileModal } from "./UserProfileModal.jsx";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";

import { UserListModal } from "./UserListModal.jsx";
import { ConvertText } from "../components/util/ConvertText.jsx";

import { useCookies } from "react-cookie";
import { config } from "../config.js";

function UserCard() {
  const [user, setUser] = useState("");
  const { userID } = useParams();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollow, setIsFollow] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userList = useDisclosure();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userListType, setUserListType] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    setUser("");
    fetch(`${config.apiUrl}/api/v1/user/whois/${userID.split("@")[1]}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
    getUserProfile();
    follower_count();
    following_count();
    check_follow();
  }, [userID]);

  const getUserProfile = async () => {
    await fetch(
      `${config.apiUrl}/api/v1/user/userLore?userID=${userID.split("@")[1]}`,
      {
        mode: "cors",
        method: "get",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUserProfile(data.lore);
      });
  };

  const follow_user = async () => {
    await fetch(
      `${config.apiUrl}/api/v1/user/follow?to_user_id=${userID.split("@")[1]}`,
      {
        method: "POST",
        credentials: "include",
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        check_follow();
        follower_count();
      });
  };
  const unfollow_user = async () => {
    await fetch(
      `${config.apiUrl}/api/v1/user/unfollow?to_user_id=${
        userID.split("@")[1]
      }`,
      {
        method: "POST",
        credentials: "include",
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        check_follow();
        follower_count();
      });
  };
  const check_follow = async () => {
    await fetch(
      `${config.apiUrl}/api/v1/user/following/check?to_user_id=${
        userID.split("@")[1]
      }`,
      {
        method: "GET",
        credentials: "include",
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsFollow(data.is_following);
      });
  };
  const follower_count = async () => {
    await fetch(
      `${config.apiUrl}/api/v1/user/follower/count?user_id=${
        userID.split("@")[1]
      }&count=10&offset=0`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFollowersCount(data.count);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };
  const following_count = async () => {
    fetch(
      `${config.apiUrl}/api/v1/user/following/count?user_id=${
        userID.split("@")[1]
      }&count=10&offset=0`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFollowingCount(data.count);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const UserListOpenTrigger = (type) => {
    setUserListType(type);
    userList.onOpen();
  };
  return (
    <>
      <UserListModal
        listType={userListType}
        user_id={userID.split("@")[1]}
        isOpen={userList.isOpen}
        onClose={userList.onClose}
      />

      {user.user_name != null ? (
        <UserProfileModal
          isOpen={isOpen}
          onClose={onClose}
          userName={user.user_name}
          userProfile={userProfile}
        />
      ) : (
        <></>
      )}
      <Box
        borderBottomWidth={"1px"}
        marginTop={"55px"}
        marginBottom={"15px"}
        // paddingBottom={"25px"}
        paddingX={{ base: "20px", sm: "45px" }}
      >
        <Flex>
          <Avatar
            size={{ base: "lg", sm: "xl" }}
            src={`${config.blobUrl}/main/${userID.split("@")[1]}/icon`}
          />

          <Box marginY={"auto"} marginLeft={"20px"}>
            <Heading size={"2xl"}>
              {!user.user_name ? "Loading..." : user.user_name}
            </Heading>
            <Text size={"lg"}>{userID}</Text>
          </Box>
          <Spacer />
          <IconButton
            size={"xs"}
            icon={<Icon as={EditIcon} />}
            variant={"ghost"}
            onClick={onOpen}
            hidden={userID.split("@")[1] !== cookies.user_id}
          />
        </Flex>
        <Text whiteSpace={"pre-wrap"} marginY={"30px"} paddingX={"15px"}>
          <ConvertText text={userProfile} />
        </Text>
        <HStack>
          <Center
            w={"50%"}
            h={"40px"}
            borderLeftWidth={"3px"}
            borderRightWidth={"3px"}
          >
            <Button
              variant={"link"}
              color={"black"}
              onClick={() => UserListOpenTrigger("フォロー")}
            >
              フォロー {followingCount}
            </Button>
          </Center>
          <Center
            w={"50%"}
            h={"40px"}
            borderLeftWidth={"3px"}
            borderRightWidth={"3px"}
          >
            <Button
              variant={"link"}
              color={"black"}
              onClick={() => UserListOpenTrigger("フォロワー")}
            >
              フォロワー {followersCount}
            </Button>
          </Center>
        </HStack>
        <HStack>
          {/* <Icon marginY={"15px"} as={CalendarMonthOutlinedIcon}/>
            <Text  marginLeft={"10px"} marginY={"auto"}>直近の予定</Text> */}
          <HStack marginY={"5px"}>
            <Show above="470px">
            <Button
              fontWeight={""}
              variant={"ghost"}
              leftIcon={<Icon as={CalendarMonthOutlinedIcon} />}
              onClick={() => navigate(`/${userID}/schedule`)}
            >
              <Text>予定</Text>
            </Button>
            </Show>
            <Show below="470px">
              <IconButton
                variant={"ghost"}
                icon={<Icon as={CalendarMonthOutlinedIcon} />}
                onClick={() => navigate(`/${userID}/schedule`)}
              />
            </Show>
            <Spacer />
            <Show above="470px">
              <Button
                fontWeight={""}
                variant={"ghost"}
                leftIcon={<Icon as={SwapHorizontalCircleOutlinedIcon} />}
                onClick={() => navigate(`/${userID}/gadgets`)}
              >
                <Text>ガジェット</Text>
              </Button>
            </Show>
            <Show below="470px">
              <IconButton
                variant={"ghost"}
                icon={<Icon as={SwapHorizontalCircleOutlinedIcon} />}
                onClick={() => navigate(`/${userID}/gadgets`)}
              />
            </Show>
          </HStack>
          <Spacer />
          <Button
            marginY={"5px"}
            variant={"solid"}
            onClick={isFollow ? unfollow_user : follow_user}
            hidden={userID.split("@")[1] === cookies.user_id}
            minW={"120px"}
          >
            <Text>{isFollow ? "アンフォロー" : "フォロー"}</Text>
          </Button>
        </HStack>
      </Box>
    </>
  );
}

export { UserCard };
