import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,

} from "@chakra-ui/react";
import { config } from "../config";
function TempAddGadget() {
  const [gadgets, setGadget] = useState(
    {
      gadget_name: "",
      gadget_image: "",
      gadget_content: "",
      gadget_tag1: "すーぱーながいもじ",
      gadget_tag2: "",
      gadget_tag3: "",
    }
  );
  const push = () => {
    fetch(`${config.apiUrl}/api/v1/gadget/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gadgets),
      credentials: 'include',
      mode: 'cors'

    })
}
useEffect(() => {
  console.log(gadgets);
}, [gadgets]);

return (
  <>
    <Input onChange={(e) => setGadget({ ...gadgets, "gadget_name": e.target.value })} />
    <Textarea onChange={(e) => setGadget({ ...gadgets, "gadget_content": e.target.value })} />
    <Button onClick={() => { push(); console.log(gadgets) }}>a</Button>

  </>
);

}
export default TempAddGadget;