import {
  Modal,
  ModalOverlay,
  ModalContent,
  CloseButton,
  ModalHeader,
  HStack,
  Heading,
  Spacer,
  ModalBody,
  Divider,
  Center,
  Avatar,
  Input,
  VStack,
  Textarea,
  ModalFooter,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  Box,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useRef } from "react";
import Cropper from "react-easy-crop";
import { config } from "../config";

function UserProfileModal(props) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [userName, setUserName] = useState(props.userName);
  const [userProfile, setUserProfile] = useState(props.userProfile);
  const inputRef = useRef();

  const postUserProfile = async () => {
    await fetch(`${config.apiUrl}/api/v1/user/userLore/set`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({ lore: userProfile }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  const handleClickAvatar = () => {
    inputRef.current.click();
  };

  const postUserName = async () => {
    console.log(userName);
    await fetch(`${config.apiUrl}/api/v1/user/username/set`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({ username: userName }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  const reloadPage = () => {
    window.location.reload();
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
      // setImageURL(croppedImage);
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

  const submitIconImage = async () =>{
    console.log("banana")
    fetch(`${config.apiUrl}/api/v1/user/change/icon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid_: imageURL.split("/").pop() }),
      mode: "cors",
      credentials: "include",
    });
  }

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [imageURL, setImageURL] = useState(`${config.blobUrl}/main/${cookies.user_id}/icon`);


  useEffect(() => {
    setImageURL(`${config.blobUrl}/main/${cookies.user_id}/icon`);
  }, [props.isOpen]);

  return (
    <>
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
      <Modal isOpen={props.isOpen} onClose={props.onClose} size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size={"md"}>プロフィール</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody borderTopWidth={"1px"}>
            <Center pb={"30px"}>
              <Avatar
                size={{ base: "2xl", md: "4xl" }}
                src={imageURL}
                boxSize={{ base: "150px", md: "250px" }}
                _hover={{
                  filter: "auto",
                  brightness: "40%",
                  _before: {
                    fontSize: { base: "10px", md: "18px" },
                    color: "white",
                    content: '"プロフィール写真を変更"',
                    position: "absolute",
                  },
                }}
                onClick={handleClickAvatar}
              />
            </Center>
            <FormControl>
              <Box>
                <FormLabel>ユーザー名</FormLabel>
                <Input
                  defaultValue={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Box>
              <Spacer margin={5} />
              <Box>
                <FormLabel>プロフィール</FormLabel>
                <Textarea
                  defaultValue={userProfile}
                  onChange={(e) => setUserProfile(e.target.value)}
                />
              </Box>
            </FormControl>
            <input
              type="file"
              style={{ display: "none" }}
              ref={inputRef}
              onChange={imageUpload}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                postUserName();
                postUserProfile();
                submitIconImage();
                setTimeout(reloadPage, 300);
                props.onClose();
              }}
            >
              更新
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export { UserProfileModal };
