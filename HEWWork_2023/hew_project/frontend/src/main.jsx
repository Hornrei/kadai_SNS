import React, { useLayoutEffect } from "react";
import { CookiesProvider,useCookies } from "react-cookie";
import ReactDOM from "react-dom/client";
import { router } from "./AppRoutes.jsx";
import { RouterProvider } from "react-router-dom";
import { ChakraProvider, extendTheme, Box, useBoolean, Icon, IconButton, AlertTitle, AlertDescription, CloseButton, AlertIcon, Alert,useDisclosure, Spacer } from "@chakra-ui/react"; // import WebFont from 'webfontloader';
import backimg from "../src/assets/camp_day.jpg";

import { PiMountainsFill,PiMountainsBold } from "react-icons/pi";
// WebFont.load({
//   google: {
//     families: ['Scada:400', 'sans-serif']
//   }
// });
// const { colorMode, toggleColorMode } = useColorMode()


function ThemeToggleButton() {
  const [cookies, setCookie, removeCookie] = useCookies(["camp_theme"]);
  console.log(cookies.camp_theme);
  const [isCampTheme, setIsCampTheme] = useBoolean(cookies.camp_theme ? true : false);
  React.useEffect(() => {
    setCookie("camp_theme", isCampTheme, { path: "/" });
  }, [isCampTheme]);
  return (
    <IconButton
      icon={<Icon  as={cookies.camp_theme ? PiMountainsFill:PiMountainsBold} />}
      onClick={setIsCampTheme.toggle}
      aria-label={"Toggle Theme"}
      variant={"ghost"}
      pos={"fixed"}
    />
  );
}

function LoginAlert() {
  const [cookies, setCookie, removeCookie] = useCookies(["user_id"]);
  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure()

  
  React.useEffect(() => {
    console.log("alert")

    onClose()
    if (!cookies.user_id && !location.href.includes("login") && !location.href.includes("signup") ) {
      onOpen()
    } else {
      onClose()
    }
  }, [location, cookies])

  return isVisible ? (
    <Alert status='error' pos={"fixed"} top={0} >
      <AlertIcon />
      <Box>
        <AlertTitle>ログインしていません</AlertTitle>
        <AlertDescription w={"100%"}>
          右のログインボタンまたは左のアイコンからログインしてください
        </AlertDescription>
      </Box>
      <Spacer />
      <CloseButton
        alignSelf='flex-start'
        position='relative'
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  ) : null
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <CookiesProvider>
    <ChakraProvider>
      <Box
        backgroundImage={backimg}
        backgroundSize={"cover"}
        backgroundRepeat={"no-repeat"}
      >
        <ThemeToggleButton/>
        <RouterProvider router={router} />
        <LoginAlert/>
      </Box>
    </ChakraProvider>
  </CookiesProvider>
);
