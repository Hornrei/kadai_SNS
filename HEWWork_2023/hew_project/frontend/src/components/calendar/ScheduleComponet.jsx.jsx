// //  eventsをDB取得実装前コード

// // // calendar.jsx
// // import React from 'react';
// // import FullCalendar from '@fullcalendar/react';
// // import dayGridPlugin from '@fullcalendar/daygrid';

// // const Calendar = () => {
// //   const events = [

// //   ];

// //   const calendarOptions = {
// //     plugins: [dayGridPlugin],
// //     initialView: 'dayGridMonth',
// //     firstDay: 1, // 月曜始まり (0が日曜始まり)
// //     contentHeight: 'auto', // カレンダーの高さをコンテンツに合わせる
// //     aspectRatio: 2, // カレンダーのアスペクト比を設定
// //     width: 1000, // カレンダー全体の幅
// //     // その他のオプションやカスタマイズはここに追加
// //   };

// //   return (
// //     <div>
// //       <FullCalendar {...calendarOptions} />
// //     </div>
// //   );
// // };

// // export default Calendar;

//eventsをDBから取得する
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@chakra-ui/react";
import { EventContainer } from "@fullcalendar/core/internal";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useParams } from "react-router-dom";
import { config } from "../../config";
import { Brand } from "../../util/Theme";

function CalendarComponent(props) {
  const [events, setEvents] = useState([]);
  const [holiday, setHoliday] = useState([]);
  const {userID} = useParams();

  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: "dayGridWeek",
    firstDay: 1,
    contentHeight: "auto",
    aspectRatio: 2,
    locale: "ja",
    today: "今日",
  };

  useEffect(() => {
    fetch("https://holidays-jp.github.io/api/v1/date.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setHoliday(
          Object.keys(data).map((key) => {
            return {
              title: data[key],
              start: key,
              color: "#ef857d",
            };
          })
        );
      })
      .catch((error) => {
        console.error("休日の取得中にエラーが発生しました:", error);
      });
    setEvents([
      {
        id: 1,
        title: "テストイベント",
        start: "2024-01-01" + "T" + "11:00",
        end: "2024-01-01" + "T" + "16:00",
      },
    ]);
  }, []);

  useEffect(() => {
    getSchedule();
  }, []);

  const getSchedule = () => {
    fetch(`${config.apiUrl}/api/v1/schedule/getSchedule?userID=${userID.split("@")[1]}`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEvents(
          data.list.map((e) => {
            return {
              id: e.schedule_id,
              title: e.content,
              start: e.start_day,
              end: e.end_day,
              location: e.location,
              userName: e.user_name,
              userID: e.user_id,
            };
          })
        );
      });
  };

  const handleDateSelect = (selectionInfo) => {
    console.log("selectionInfo: ", selectionInfo); // 選択した範囲の情報をconsoleに出力
    props.dayClick();
    const calendarApi = selectionInfo.view.calendar;
    props.clickDataDay(selectionInfo.startStr);
    calendarApi.unselect(); // 選択した部分の選択を解除
  };

  const handleEventClick = (clickInfo) => {
    props.eventClick();
    props.event(clickInfo.event);
  };

  return (
    <Box
      maxH={"87%"}
      overflowY={"scroll"}
      scrollbar-color={Brand["100.5"]}
      sx={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: Brand["100.5"],
          borderRadius: "24px",
        },
      }}
    >
      <FullCalendar
        {...calendarOptions}
        events={[...holiday, ...events]}
        select={handleDateSelect}
        selectable={true}
        navLinks={true}
        eventClick={(info) => {
          handleEventClick(info);
          console.log(info.event._instance.range.end.toISOString());
          console.log("aaa");
        }}
        // displayEventTime={false}
        // eventDisplay="block"
        locale={"ja"}
        buttonText={{ today: "今日", day: "日", month: "月" }}
        headerToolbar={{
          left: "prev,next,today",
          center: "title",
          right: "dayGridMonth,timeGridDay",
        }}
      />
    </Box>
  );
}

export default CalendarComponent;
