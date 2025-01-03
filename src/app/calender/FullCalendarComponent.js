import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast, ToastContainer } from "react-toastify";
const FullCalendarComponent = ({ bookings, onDateClick, userData }) => {
  const [events, setEvents] = useState([
    {
      start: "2025-01-05 13:00",
      end: "2025-01-05 15:00",
      title: "booked",
      color: "grey",
    },
    {
      start: "2025-01-05 16:00",
      end: "2025-01-05 18:00",
      title: "booked",
      color: "grey ",
    },
  ]);

  const handleDateClick = (arg) => {
    onDateClick(arg);
  };

  const handleEventClick = () => {
    toast(`No slots Available for Selected Time`);
  };
  return (
    <>
      {/* <div className="grid place-items-center h-full w-full bg-black">
        <ToastContainer  position="top-center" autoClose={10000} />
      </div> */}
      <div
        style={{
          maxWidth: "360px",
          height: "100%",
          margin: "auto",
          fontSize: "11px",
        }}
       
      >
        <FullCalendar
        select={true} 
          height={"200px"}
          themeSystem="bootstrap"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={bookings}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          droppable={false}
          eventConstraint={true}
          editable={true}
          selectable={true}
          allDaySlot={false}
          weekends={true}
          slotMinTime={"12:00:00"}
          slotMaxTime={"22:00:00"}
          slotDuration={"02:00:00"}
          headerToolbar={{
            left: "prev next today",
            center: "title",
            right: "timeGridWeek timeGridDay",
          }}
          buttonText={{
            day: "Day",
            month: "Month",
            week: "Week",
            list: "List",
            today: "2day",
          }}
        />
      </div>
    </>
  );
};

export default FullCalendarComponent;
