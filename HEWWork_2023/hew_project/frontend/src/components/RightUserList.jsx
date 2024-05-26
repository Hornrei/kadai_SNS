import React, {useState,useEffect} from "react";
import {useCookies } from "react-cookie";

import { useNavigate } from "react-router-dom";
import { Show, Box, Center, Button, Text, Hide, Tabs, TabList, Tab, TabPanels, TabPanel, useMediaQuery, Flex, Avatar, Container } from "@chakra-ui/react";
import { SmallUserBox } from "../components/UserBox.jsx";
import { config } from "../config.js";
import { Brand } from "../util/Theme.js";

function RightUserList() {
  const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  const [userProfile, setUserProfile] = useState("");

  useEffect(() => {
    fetch(`${config.apiUrl}/api/v1/user/following?userID=${cookies.user_id}&count=10&offset=0`)
      .then((res) => res.json())
      .then((data) => {
        setFollowers(data.users);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
    fetch(`${config.apiUrl}/api/v1/user/follower?userID=${cookies.user_id}&count=10&offset=0`)
      .then((res) => res.json())
      .then((data) => {
        setFollowing(data.users);
      }
      )
      .catch((error) => {
        console.error('Error fetching data: ', error);
      }
      );

    
    getUserProfile();
  }, []);

  const getUserProfile = async() => {
    await fetch(`${config.apiUrl}/api/v1/user/userLore?userID=${cookies.user_id}`, {
      mode: "cors",
      method: "get"
    })
    .then((res) => res.json())
    .then((data) => {
      setUserProfile(data.lore);
    })
  }

  return (
    <Show above="1050px">
      <Box minWidth={"300px"} w={isLargerThan1200 ? "300px" : "100%"} backgroundColor={Brand["50"]}>
        <Box margin={"20px"}>
          <Flex>
            <Avatar size={"sm"} src={`${config.blobUrl}/main/${cookies.user_id}/icon`}/>
            <Text fontWeight={"bold"} margin={"auto 10px"}>
              {cookies.user_id ? cookies.user_id : "ユーザー名"}
            </Text>
          </Flex>
          <Container
            marginTop={"15px"}
            borderWidth={"2px"}
            borderTopRightRadius={"10px"}
            borderBottomLeftRadius={"10px"}
            borderColor={Brand["blue"]}
            h={"150px"}
          >
            <Text whiteSpace={"pre-wrap"} noOfLines={6}>
              {userProfile}
            </Text>
          </Container>
        </Box>
        <Tabs isFitted>
          <TabList>
            <Tab>フォロー</Tab>
            <Tab>フォロワー</Tab>
          </TabList>
          <TabPanels >
            <TabPanel marginTop={"10px"} padding={"0"} >
              <Box
                h={"calc(100vh - 520px)"}
                overflowY={"scroll"}
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
                {/* フォローリスト */}
                {followers?.map((user) => (
                  <SmallUserBox key={user.user_id} userID={user.user_id} userName={user.user_name} />
                ))}
              </Box>
            </TabPanel>
            <TabPanel marginTop={"10px"} padding={"0"} >
              <Box
                h={"calc(100vh - 520px)"}
                overflowY={"scroll"}
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
                {/* フォロワーリスト */}
                {following?.map((user) => (
                  <SmallUserBox key={user.user_id} userID={user.user_id} userName={user.user_name} />
                ))}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Center marginTop={"20px"}>
          <Button size={"lg"} w={"80%"} onClick={()=> navigate(cookies.user_id ? "/logout":"/login")}>
            {cookies.user_id ? "ログアウト" : "ログイン/新規登録"}
          </Button>
        </Center>
      </Box>
    </Show>
  );
}

export { RightUserList };



