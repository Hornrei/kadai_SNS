import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { config } from "../config";

/**
 *
 * @param {Object} props
 * @param {string} props.userID - ユーザーのID
 * @param {string} props.userName - ユーザー名
 */
function SmallUserBox(props) {
  const navigate = useNavigate();
  return (
    <Box
      cursor={"pointer"}
      onClick={() => navigate(`/@${props.userID}`)}
      padding={"10px"}
    >
      <Flex marginBottom={"10px"}>
        <Avatar size={"sm"} marginRight={"10px"} src={`${config.blobUrl}/main/${props.userID}/icon`} />
        <Box>
          <Text fontWeight={"bold"} fontSize={"xs"}>
            {props.userName ? props.userName : "ユーザー名"}
          </Text>
          <Text fontSize={"2xs"}>
            {props.userID ? "@"+props.userID : "ユーザーID"}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}


export { SmallUserBox };
