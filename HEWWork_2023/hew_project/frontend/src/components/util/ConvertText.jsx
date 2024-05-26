import React from "react";
import { Link, Text } from "@chakra-ui/react";


const convertUrlsToLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <Link
          href={part}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </Link>
      );
    } else {
      return part;
    }
  });
};

// postTextを受け取り、必要に応じてURLをアンカータグに置き換えるコンポーネント
export const ConvertText = (props) => {
  return (
    <Text whiteSpace="pre-wrap">
      {props.text ? convertUrlsToLinks(props.text) : ""}
    </Text>
  );
};