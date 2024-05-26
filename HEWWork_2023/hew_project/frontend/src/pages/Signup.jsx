import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  Center,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  Icon,
  IconButton,
  Container,
  Flex,
  VStack,
  Stack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Heading,
  Text,
  Show,
  Hide,
  useMediaQuery,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import Cropper from "react-easy-crop";

import logo1 from "../assets/logo1.png";
import { config } from "../config";
import { Brand } from "../util/Theme";
import Header from "../components/Header";

function Signup() {
  const inputRef = useRef(null);
  const [imageURL, setImageURL] = useState("");
  const [userIDCheck, setUserIDCheck] = useState(true);
  const [time, setTime] = useState(null);
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropDialog, setShowCropDialog] = useState(false);

  const handleClick = () => {
    setImageURL("");
    inputRef.current.click();
  };

  const checkUserID = (event) => {
    const value = event.target.value;
    setUserID(value);
    setUserIDCheck(true);
    clearTimeout(time);
    const newTime = setTimeout(() => {
      fetch(`${config.apiUrl}/api/v1/user/check/id?user_id=${value}`, {
        method: "GET",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((data) => {
          setUserIDCheck(data.status);
        });
    }, 500);
    setTime(newTime);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const createUserData = () => {
    if (!userID || !username) {
      return;
    }
    

    fetch(`${config.apiUrl}/api/v1/user/create`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userID,
        user_name: username,
        image_url: imageURL,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          if (imageURL) {
            fetch(`${config.apiUrl}/api/v1/user/change/icon?`, {
              method: "POST",
              mode: "cors",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ uuid_: imageURL.split("/").pop() }),
           });
          }
          navigate("/");
        } else {
          alert("登録に失敗しました");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const imageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setShowCropDialog(true);
      setImageURL(reader.result);
    };
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // CORS設定が必要な場合
      image.src = url;
    });

  async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // キャンバスのサイズをクロップされた領域のサイズに設定
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // クロップされた領域をキャンバスに描画
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // 新しい画像データをDataURLとして取得
    return new Promise((resolve) => {
      const dataUrl = canvas.toDataURL("image/jpeg");
      resolve(dataUrl);
    });
  }
  const handleCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(imageURL, croppedAreaPixels);
      setImageURL(croppedImage);
      const base64CroppedImage = croppedImage;
      fetch(`${config.apiUrl}/api/v1/user/upload/icon`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64CroppedImage }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          data.image_url ? setImageURL(data.image_url) : setImageURL(null);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      setShowCropDialog(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Header cHidden={true} />

      <Box h={"calc(100vh - 70px)"}>
        <VStack>
          <Heading m="20px 0">新規登録</Heading>
          <Avatar
            onClick={handleClick}
            borderRadius="full"
            size={"2xl"}
            src={imageURL}
            background={"blackAlpha.600"}
          />
          <Button
            onClick={handleClick}
            m="20px"
            bg="green.100"
            _hover={{ bg: "green.300" }}
          >
            アイコンを編集
          </Button>
          <Input
            type="text"
            placeholder=" userID"
            borderColor="blackAlpha.600"
            onChange={checkUserID}
            w="80%"
            maxW={"600px"}
            variant="flushed"
            focusBorderColor="green.200"
            backgroundColor={"whiteAlpha.600"}
          />
          <Input
            type="text"
            placeholder=" username"
            borderColor="blackAlpha.600"
            onChange={handleUsernameChange}
            w="80%"
            maxW={"600px"}
            variant="flushed"
            focusBorderColor="green.200"
            backgroundColor={"whiteAlpha.600"}
          />
          <input
            type="file"
            style={{ display: "none" }}
            ref={inputRef}
            onChange={imageUpload}
          />
          <Button
            isDisabled={userIDCheck || !userID || !username}
            onClick={createUserData}
            size="lg"
            mt="30px"
            bg="green.100"
            _hover={{ bg: "green.300" }}
          >
            登録
          </Button>
        </VStack>
      </Box>
      {showCropDialog && (
        <Modal isOpen={showCropDialog} onClose={() => setShowCropDialog(false)}>
          <ModalContent maxW={"80%"} p={0} m={0}>
            <Box w={"80vw"} h={"100vh"}>
              <Cropper
                image={imageURL}
                crop={crop}
                zoom={zoom}
                aspect={3 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <Button pos={"absolute"} bottom={1} onClick={handleCropConfirm}>
                確定
              </Button>
            </Box>
            {/* <Button onClick={handleCropConfirm}>クロップ</Button> */}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default Signup;
