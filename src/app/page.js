"use client";
import { useState } from "react";
import Modal from "./modal/modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import FullCalendarComponent from "./calender/FullCalendarComponent";
// import dotenv from "dotenv"

// dotenv.config()
const tables = [
  { id: "0817x1irop468dy", no: 1 },
  { id: "0817x1irop468d6", no: 2 },
  { id: "0817x1irop468dg", no: 3 },
  { id: "0817x1irop468df", no: 4 },
  { id: "0817x1irop468dd", no: 5 },
  { id: "0817x1irop468de", no: 6 },
];

export default function Home() {
  // calender states here
  const [tableId, setTableId] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [bookings, setBookings] = useState([]);
  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, mobile, guests, start, end } = userData;
    if (!(name && mobile && guests && start && end)) {
      toast(`Please Fill All Required Details`);
    } else {
      bookSlot();
    }
  };
  const handleClick = (id) => {
    setTableId(id);
    console.log(process.env.NEXT_PUBLIC_SERVER_URL);
    axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/booking/${id}`).then((res) => {
      setBookings(
        res.data.data.map((e) => {
          return {
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
            color: "grey",
            tilte: "Booked",
          };
        })
      );
    });
    openModal();
  };
  const incDate = (datestr) => {
    const newDate = new Date(datestr);
    // console.log(newDate.getHours()+1);
    newDate.setHours(newDate.getHours() + 1);
    return newDate;
  };

  const bookSlot = async () => {
    const data = {
      name: userData.name,
      mobile: userData.mobile,
      count: userData.guests,
      start: userData.start,
      end: userData.end,
      table: tableId,
      tableNo: tableNo,
    };
    await axios
      .post(process.env.NEXT_PUBLIC_SERVER_URL + "/book", data)
      .then((res) => {
        toast(res?.data?.message);
        console.log(res.data.message);
        setUserData({});
      })
      .then(() => {
        closeModal();
      });
  };
  const handleDateClick = (arg) => {
    setUserData({
      ...userData,
      start: new Date(arg.dateStr).toString(),
      end: new Date(incDate(arg.dateStr)).toString(),
    });
  };
  const convertToLocal = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString("en-GB", { hour12: false });
  };
  //
  return (
    <>
      <div className="grid place-items-center ">
        <ToastContainer
          position="top-center"
          closeButton={false}
          autoClose={5000}
        />
      </div>
      <div className=" bg-[url('../app/Images/hotel3.jpg')] bg-cover aspect-auto h-[100vh] grid justify-items-center items-center brightness-110  ">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-5 justify-items-center md:backdrop-blur-md md:border rounded-xl p-4 ">
          <h1 className="md:col-span-3 col-span-1 text-white text-3xl md:text-5xl mt-2 p-2 border bg-green-600 rounded-xl ">
            Welcome To Spice Lab
          </h1>
          <h1 className="md:col-span-3 col-span-1 text-white text-xl md:text-3xl mt-2 p-2 border backdrop-blur-md rounded-xl ">
            Choose a Table to Book
          </h1>
          {tables.map((table) => {
            return (
              <div
                key={table.id}
                role="button"
                onClick={() => handleClick(table.id, setTableNo(table.no))}
                className="text-4xl text-white backdrop-blur-xl border-2 p-2 rounded-xl bg-gray-600 transition-all delay-0 duration-500 hover:-translate-y-1"
              >
                {" "}
                Table No : {table.no}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-bold text-gray-800">Enter Details</h2>
        <div>
          <form className="w-full flex flex-col justify-center items-center gap-1 p-1">
            <span>Table No:{tableNo}</span>
            <input
              value={userData?.name || ""}
              name="name"
              onChange={handleChange}
              type="text"
              required
              title="Enter Your Name Here"
              placeholder="Name"
              className="xl:w-[70%] w-full h-10 rounded-xl px-4 border  border-b-4 border-mediumPurple"
            />
            <input
              value={userData?.mobile || ""}
              name="mobile"
              onChange={handleChange}
              autoComplete="home mobile webauthn"
              type="tel"
              required
              title="Enter Your Mobile Number here "
              placeholder="Mobile"
              className="xl:w-[70%] w-full h-10 rounded-xl px-4 border  border-b-4 border-mediumPurple"
            />
            <input
              min={0}
              max={15}
              value={userData?.guests || ""}
              name="guests"
              onChange={handleChange}
              type="number"
              required
              title="Enter Count of Guests here "
              placeholder="No Of Guests"
              className="xl:w-[70%] w-full h-10 rounded-xl px-4 border  border-b-4 border-mediumPurple"
            />
            <FullCalendarComponent
              bookings={bookings}
              onDateClick={handleDateClick}
            />

            <span>
              {userData.start
                ? `${convertToLocal(userData.start)} - ${convertToLocal(
                    userData.end
                  )}`
                : ""}
            </span>
            <button
              className="bg-gray-300 p-2 rounded-xl"
              onClick={handleFormSubmit}
            >
              Book Your Slot
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
