import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Box,
  Text,
  Heading,
  Image,
  HStack,
  Tag,
  filter,
} from "@chakra-ui/react";
import { config } from "../../config";
/**
 *
 * @param {Object} props
 * @param {string} props.userID 
 * @param {string} props.gadgetID - ガジェットID
 * @param {string} props.gadgetName - ガジェット名
 * @param {list} props.gadgetTag - ガジェットタグ
 */
function GadgetCard(props) {
  return (
    <Card
      h={"300px"}
      w={"300px"}
      marginBottom={"40px"}
      onClick={props.onClick}
      filter={"auto"}
      _hover={{brightness:"90%", backdropBlur:"90%"}}
    >
      <CardBody>
        <Image
          src={
            `${config.blobUrl}/main/${props.userID}/gadgets/${props.gadgetID}`
          }
          fit={"cover"}
          borderRadius={"20px"}
          // 画像サイズを固定
          w={"100%"}
          h={"150px"}
        />
        <Heading marginTop={"12px"} noOfLines={1}>{props.gadgetName}</Heading>
      </CardBody>
      <CardFooter>
        <HStack>
          {props.gadgetTag?.map((tag) => {
            return (
              <Tag fontSize={"12px"} key={Math.random()}>
                {tag}
              </Tag>
            );
          })}
        </HStack>
      </CardFooter>
    </Card>
  );
}

export { GadgetCard };
