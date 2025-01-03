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
const regex = /[a-zA-Z]/;
const regexChar = /[^0-9]/;
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
    } else if (name.length < 4 || name.length > 20) {
      toast(`Enter a Valid name`);
    } else if (regex.test(mobile) || regexChar.test(mobile)) {
      toast("Enter Valid Mobile Number");
    } else {
      bookSlot();
    }
  };
  const handleClick = (id) => {
    setTableId(id);
    axios
      .get(process.env.NEXT_PUBLIC_SERVER_URL + `/booking/${id}`)
      .then((res) => {
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
      <div className="w-full h-full flex justify-center items-center">
        <ToastContainer
          className={"mt-2 md:mt-5 px-5 md:px-0 md:w-full "}
          position="top-center"
          closeButton={true}
          autoClose={5000}
        />
      </div>
      <div className=" bg-[url('../app/Images/dineTable.jpg')] bg-cover aspect-auto h-[100dvh] grid justify-items-center items-center brightness-100  ">
        <div className="group grid md:grid-cols-3 grid-cols-1 gap-3 justify-items-center backdrop-blur-lg md:border rounded-xl p-4 ">
          <h1 className="z-10 md:group-hover:-translate-y-14 transition-all duration-300 md:col-span-3 col-span-1 text-white text-2xl md:text-5xl mt-0 p-3 border bg-[#8EB486] rounded-xl ">
            Welcome To Spice Lab
            <span role="img" className="text-4xl">👨‍🍳</span>
          </h1>
          <h1 className="md:-translate-y-20 md:col-span-3 col-span-1 text-white text-base md:text-3xl mt-2 p-2 border backdrop-blur-md rounded-xl ">
            Choose a Table to Book
          </h1>
          {tables.map((table) => {
            return (
              <div
                key={table.id}
                role="button"
                onClick={() => handleClick(table.id, setTableNo(table.no))}
                className="text-3xl text-white hover:border-[#8EB486] hover:-translate-y-1 border-2  p-2 rounded-xl transition-all duration-300 "
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
        <h2 className="text-xl font-bold text-gray-800">
          Enter Details And Slot
        </h2>
        <div className="w-full flex justify-center items-center">
          <form className="w-full md:w-full flex flex-col justify-center items-center gap-1 p-1">
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
              minLength={10}
              maxLength={10}
              value={userData?.mobile || ""}
              name="mobile"
              onChange={handleChange}
              autoComplete="home mobile webauthn"
              type="tel"
              required={true}
              aria-required={true}
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
            <div className="w-[90%]">
              <FullCalendarComponent
                bookings={bookings}
                onDateClick={handleDateClick}
              />
            </div>

            <span>
              {userData.start
                ? `Selected: ${convertToLocal(userData.start)} - ${convertToLocal(
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
