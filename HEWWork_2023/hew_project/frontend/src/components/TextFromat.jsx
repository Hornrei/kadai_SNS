
import React from "react";
import { Box, HStack, Text } from "@chakra-ui/react";


/**
*
* YYYY-MM-DDをYYYY年MM月DD日に変換する
* @param {string} date - YYYY-MM-DD形式の日付
* @param {string} yearSpace - 年の間に入れる文字列
* @param {string} monthSpace - 月の間に入れる文字列
* @param {string} daySpace - 日の間に入れる文字列
* @param {object} textOption - Textコンポーネントに渡すオプション
* @param {object} rootOption - Boxコンポーネントに渡すオプション
* @returns {string} YYYY年MM月DD日形式の日付
*/
export function DayFormat(props) {
  // YYYY-MM-DDをYYYY年MM月DD日に変換する
  if (!props.date) {
    return null;
  }
  const date = props.date;
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  return (
    <Box {...props.rootOption}>
      <HStack spacing={0}>
        <Text {...props.textOption} >{year}{props.yearSpace}</Text>
        <Text {...props.textOption}>{month}{props.monthSpace}</Text>
        <Text {...props.textOption}>{day}{props.daySpace}</Text>
      </HStack>
    </Box>
  );
}
