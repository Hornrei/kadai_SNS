import { useCookies } from "react-cookie";

export const Brand = {

  //index.jsxおすすめ,フォロー
  "50": () => {
    const [cookies, setCookie, removeCookie] = useCookies(["camp_theme"]);
    return cookies.camp_theme ? "green.50" : "whiteAlpha.600";
  },


  //header.jsx
  "100.5": () => {
    const [cookies, setCookie, removeCookie] = useCookies(["camp_theme"]);
    return cookies.camp_theme ? "green.200" : "whiteAlpha.800";
  },

  "100": () => {
    const [cookies, setCookie, removeCookie] = useCookies(["camp_theme"]);
    return cookies.camp_theme ? "green.100" : "whiteAlpha.400";
  },

  //headerの検索欄
  "white": () => {
    const [cookies, setCookie, removeCookie] = useCookies(["camp_theme"]);
    return cookies.camp_theme ? "white" : "whiteAlpha.600";
  },

  "blue": () => {
    const [cookies, setCookie, removeCookie] = useCookies(["camp_theme"]);
    return cookies.camp_theme ? "green.200" : "blue.200";
  }
}