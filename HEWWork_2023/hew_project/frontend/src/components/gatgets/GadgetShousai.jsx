import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  AspectRatio,
  Flex, // Flex コンポーネントをインポート
} from "@chakra-ui/react";

export function GadgetDetailModal(props) {
  // propsからガジェットの情報を取得
  const { isOpen, onClose, gadget } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="800px">
        <ModalHeader>ガジェットの詳細</ModalHeader>
        <ModalBody>
          <HStack spacing={15}>
            <AspectRatio ratio={16 / 9} w="40%">
              <Image src={gadget.image} borderRadius={10} />
            </AspectRatio>
            <VStack align="start" spacing={4} w="60%">
              <Text fontSize="2xl" fontWeight="bold">
                {gadget.name}
              </Text>
              <Text>公開したユーザー: {gadget.user}</Text>
              <HStack spacing={2}>
                {gadget.tags.map((tag, index) => (
                  <Button key={index} size="sm" variant="outline">
                    {tag}
                  </Button>
                ))}
              </HStack>
              <Text>{gadget.description}</Text>
              <Flex justify="center">
                <Button colorScheme="blue" mr={4}>
                  借りる
                </Button>{" "}
                <Button onClick={onClose}>閉じる</Button>
              </Flex>
            </VStack>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
