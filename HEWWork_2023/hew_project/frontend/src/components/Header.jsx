import React from "react";

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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import logo1 from "../assets/campection2.png";
import { PostModal } from "./PostModal";
import { useNavigate } from "react-router-dom";
import { Brand } from "../util/Theme";

function Header(props) {
  const navigate = useNavigate();
  return (
    <>
      <Box backgroundColor={Brand["100.5"]}>
        <Center>
          <Image src={logo1} h={"70px"} opacity={"1"} />
        </Center>
      </Box>
      <Center h={"70px"} hidden={props.cHidden}>
        <InputGroup
          w={"80vw"}
          maxW={"700px"}
          minW={"210px"}
          typeof="text"
          borderRadius={10}
          backgroundColor={Brand["white"]}
        >
          {" "}
          //テーマを変えたときの相談
          <Input
            defaultValue={props.keyword}
            type="search"
            placeholder="キーワード検索"
            onChange={props.searchValue}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?q=${e.target.value}`);
              }
            }}
          />
          {/* これないとなぜかパスワードフォームになる */}
          <Input type="text" placeholder="キーワード検索" display={"none"} />
          <InputRightElement>
            <SearchIcon />
          </InputRightElement>
        </InputGroup>
      </Center>
    </>
  );
}

export default Header;
