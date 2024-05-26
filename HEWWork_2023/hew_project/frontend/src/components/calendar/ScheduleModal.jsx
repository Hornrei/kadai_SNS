import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FaLocationDot } from "react-icons/fa6";
import {
  Box,
  Input,
  Stack,
  Button,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  Heading,
  Divider,
  Spacer,
  Avatar,
} from "@chakra-ui/react";

export function SetScheduleModal(props) {
  const initialScheduleState = {
    scheduleName: "",
    startDate: props.toDay,
    scheduleTime: props.toTime || "12:00",
    endDate: props.toDay,
    scheduleEndTime: props.toTime || "12:00",
  };

  const [schedule, setSchedule] = useState(initialScheduleState);
  useEffect(() => {
    setSchedule(initialScheduleState);
  }, [props.isOpen]);

  async function handleSubmit() {
    console.log("予定名:", schedule.scheduleName);
    console.log("開始日:", schedule.startDate);
    console.log("開始時間:", schedule.scheduleTime);
    console.log("終了日:", schedule.endDate);

    await fetch(`${config.apiUrl}/api/v1/schedule/addSchedule`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scheduleName: schedule.scheduleName,
        startDate: schedule.startDate + "T" + schedule.scheduleTime,
        endDate: schedule.endDate + "T" + schedule.scheduleEndTime,
        location: schedule.location,
        visibility: true
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
        props.onClose();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton />
          <Text>予定の登録</Text>
        </ModalHeader>
        <ModalBody>
          <VStack align={"left"} spacing={6}>
            <FormControl>
              <Input
                type="text"
                name="scheduleName"
                placeholder="予定を入力"
                onChange={(e) =>
                  setSchedule({ ...schedule, scheduleName: e.target.value })
                }
                variant={"flushed"}
                autoFocus={true}
              />
            </FormControl>
            <HStack>
              <FormControl>
                <FormLabel>開始日</FormLabel>
                <Input
                  type="date"
                  name="startDate"
                  placeholder="開始日"
                  fontSize="15px"
                  defaultValue={schedule.startDate}
                  readOnly={!!schedule.startDate}
                  onChange={(e) =>
                    setSchedule({ ...schedule, startDate: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>開始時間</FormLabel>
                <Input
                  type="time"
                  name="scheduleTime"
                  placeholder="開始時間"
                  defaultValue={"12:00"}
                  onChange={(e) =>
                    setSchedule({ ...schedule, scheduleTime: e.target.value })
                  }
                  fontSize="15px"
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl>
                <FormLabel>終了日</FormLabel>
                <Input
                  type="date"
                  name="endDate"
                  placeholder="終了日"
                  defaultValue={schedule.endDate}
                  onChange={(e) =>
                    setSchedule({ ...schedule, endDate: e.target.value })
                  }
                  fontSize="15px"
                />
              </FormControl>
              <FormControl>
                <FormLabel>終了時間</FormLabel>
                <Input
                  type="time"
                  name="endDate"
                  placeholder="終了時間"
                  defaultValue={"13:00"}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      scheduleEndTime: e.target.value,
                    })
                  }
                  fontSize="15px"
                />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>場所</FormLabel>
              <Input
                type="text"
                name="location"
                placeholder="場所を入力"
                variant={"flushed"}
                onChange={(e) =>
                  setSchedule({
                    ...schedule,
                    location: e.target.value,
                  })
                }
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={props.onClose}>
            閉じる
          </Button>
          <Button
            type="submit"
            form="scheduleForm"
            colorScheme="green"
            onClick={handleSubmit}
            ml={1}
          >
            送信
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

import EventClickArg from "@fullcalendar/react";
import { DayFormat } from "../TextFromat";
import { config } from "../../config";
/**
 * 予定の表示
 * @param {EventClickArg} event
 */
export function ShowScheduleModal(props) {
  console.log(props.event);
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton />
          <Text>予定の表示</Text>
        </ModalHeader>
        <ModalBody>
          <VStack alignItems={"start"} spacing={2}>
            <Heading as={"h5"} size={"lg"} pl={2}>
              {props.event?.title}
            </Heading>
            <HStack spacing={5}>
              <Box pl={"10px"} lineHeight={1.2}>
                <DayFormat
                  rootOption={{ fontSize: "13px" }}
                  date={props.event?.startStr.slice(0, 10)}
                  yearSpace={"年"}
                  monthSpace={"月"}
                  daySpace={"日"}
                />
                <Text>{props.event?.startStr.slice(11, 16)}</Text>
              </Box>
              <Text>～</Text>
              <Box lineHeight={1.2}>
                <DayFormat
                  rootOption={{ fontSize: "13px" }}
                  date={props.event?._instance.range.end
                    .toISOString()
                    .slice(0, 10)}
                  yearSpace={"年"}
                  monthSpace={"月"}
                  daySpace={"日"}
                />
                <Text>
                  {props.event?._instance.range.end.toISOString().slice(11, 16)}
                </Text>
              </Box>
            </HStack>
            <Spacer />
            <Spacer />
            <HStack pl={1}>
              <FaLocationDot size={"1.3em"} />
              <Text>{props.event?.extendedProps.location}</Text>
            </HStack>
            <Spacer />
            <HStack pl={1}>
              <Avatar size={"sm"} src={`${config.blobUrl}/main/${props.event?.extendedProps.userID}/icon`} />
              <Text >{props.event?.extendedProps.userName}</Text>
              {console.log(props.event?.extendedProps)}
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={props.onClose}>
            閉じる
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
