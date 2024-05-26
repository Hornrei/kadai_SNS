// App.jsx
import React, { useState,useCallback } from 'react';
import {
  Container,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import CalendarComponent from '../components/calendar/CalendarComponent.jsx';
import {SetScheduleModal, ShowScheduleModal} from '../components/calendar/ScheduleModal.jsx';
import { LeftIconBar } from '../components/LeftIconBar.jsx';
import { Flex } from '@chakra-ui/react';
import { Brand } from '../util/Theme.js';

import Header from '../components/Header';
function Calendar() {
  const set = useDisclosure();
  const show = useDisclosure();
  const [schedule, setSchedule] = useState();
  const [toDay, setToDay] = useState();
  const [event, setEvent] = useState();


  return (
    <>
      <Header />
      <Flex
        backgroundColor={Brand["50"]}
        maxW={"1300px"}
        margin={"auto"}
        borderWidth={"1px"}
        borderTopRadius={"10px"}
      >
        <LeftIconBar />
        <Container
          maxW="container.xl"
          h={"calc(100vh - 142px)"}
          borderLeftWidth={"1px"}
          pt={"10px"}
        >
          {/* カレンダー */}
          <CalendarComponent dayClick={set.onOpen} clickDataDay={setToDay} eventClick={show.onOpen} event={setEvent} />
          <Button onClick={()=>{set.onOpen();setToDay(null)}} mt={"10px"}>予定の登録</Button>
        </Container>
      </Flex>
      <SetScheduleModal isOpen={set.isOpen} onClose={set.onClose} onOpen={set.onOpen} toDay={toDay} />
      <ShowScheduleModal isOpen={show.isOpen} onClose={show.onClose} onOpen={show.onOpen} event={event}/>
    </>
  );
}

export default Calendar;


