import React from "react";
import { Button, Tag, Card, Result } from "antd";
import { CheckCircleTwoTone, ExclamationCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { FaTicket } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";



const ticketInfo = {
  id: "#DORA-8386AK",
  movie: "PHIM ĐIỆN ẢNH DORAEMON: NOBITA VÀ CUỘC PHIÊU LƯU VÀO THẾ GIỚI TRONG TRANH",
  screen: "IMAX",
  showtime: "26/05/2025 - 09:30 AM",
  room: "Cinema Hall 3",
  // combo: ["Combo 1 Popcorn + 2 Pepsi x 1", "Combo 1 Popcorn + 1 Pepsi x 2"],
  seats: ["A6", "B6", "C6", "D6", "E6"],
  price: 10,
  total: 40,
  discount: "50%",
  totalAfterDiscount: 25,
  score: 0,
};

const memberInfo = {
  id: "ABCMinh123",
  identity: "123456789",
  name: "Nguyen Ngoc Minh",
  phone: "0866679409",
};

const statusMap = {
  success: {
    icon: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 80 }} />,
    title: "Success payment",
    color: "text-green-500",
    bg: "bg-green-50",
    btn: "New ticket(s)",
    btnColor: "white",
    backgroundColor: "#7254EF",
    btnIcon: <FaTicket />,
    font: "none",
  },
  warning: {
    icon: <ExclamationCircleTwoTone twoToneColor="#faad14" style={{ fontSize: 80 }} />,
    title: "Payment warning",
    color: "text-yellow-500",
    btnColor: "white",
    bg: "bg-yellow-50",
    btn: "Try again",
    backgroundColor: "#faad14",
    btnIcon: <i className="fa-solid fa-rotate-right"></i>,
    font: "bold",
  },
  error: {
    icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 80 }} />,
    title: "Payment failed",
    color: "text-red-500",
    bg: "bg-red-50",
    btn: "Retry",
    backgroundColor: "red",
    btnColor: "white",
    btnIcon: <IoReloadOutline />,
  },
};

export default function TicketInfomation({ status = "success" }) {
  const statusObj = statusMap[status];

  return (
    <div className="p-4 w-full ">
      <h1 className="text-3xl font-bold mb-4 text-fuchsia-700">Payment</h1>
      {/* Movie Info */}
      <div className="flex items-start gap-4 border-b border-gray-300 pb-4">
        <img
          src="https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/c/o/copy_of_250220_dr25_main_b1_localized_embbed_1_.jpg"
          alt="Poster Doraemon"
          className="w-40 h-auto rounded shadow"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className="text-[#FFF8A7] p-1 rounded-full shadow-md w-[125px] h-[30px] flex items-center justify-center mb-2"
              style={{
                background:
                  "linear-gradient(90deg, #FACC15, #DDB61A, #DBBB3B, #CDB03D, #B1900C)",
              }}
            >
              <p className="font-bold p-2 text-sm">Now Showing</p>
            </div>
            <Tag color="purple" style={{ border: "1px solid purple" }}>
              IMAX
            </Tag>
          </div>
          <h2 className="text-xl font-bold mt-2 p-4">
            {ticketInfo.movie}
          </h2>
          <p className="text-sm mt-1 ">
            <span className="p-2">
              <i className="fa-solid fa-clock"></i> {ticketInfo.showtime}
            </span>
            <span className="p-2">
              <i className="fa-solid fa-location-dot"></i> {ticketInfo.room}
            </span>
            <span className="p-2">
              <i className="fa-solid fa-couch"></i> Rows: A-H
            </span>
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col items-center justify-center my-8">
        {statusObj.icon}
        <div className={`mt-4 text-3xl font-bold ${statusObj.color}`}>
          {statusObj.title}
        </div>
      </div>

      {/* Ticket & Member Info */}
      <div className="flex gap-2 justify-center w-full">
        {/* Ticket */}
        <Card
          className="w-[70%] rounded-2xl shadow-md"
          title={
            <span className="font-bold text-lg">
              <i className="fa-solid fa-ticket mr-2"></i>Tickets
            </span>
          }
        >
          <div className="flex flex-col gap-2 text-base">
            <div className="border-b border-gray-300 mb-4">
              <div className="flex items-center pt-2 pb-2">
                <strong className="w-[25%]">ID Ticket:</strong> <span>{ticketInfo.id}</span>
              </div>
              <div className="flex items-center pt-2 pb-2">
                <strong className="w-[26%]">Movie:</strong> <span>{ticketInfo.movie}</span>
              </div>
              <div className="flex items-center pt-2 pb-2">
                <strong className="w-[25%]">Screen:</strong> <span>{ticketInfo.screen}</span>
              </div>
              <div className="flex items-center pt-2 pb-2">
                <strong className="w-[25%]">Showtime:</strong> <span>{ticketInfo.showtime}</span>
              </div>
              <div className="flex items-center pt-2 pb-2">
                <strong className="w-[25%]">Room:</strong> <span>{ticketInfo.room}</span>
              </div>
              {/* <div>
              <strong>Combo:</strong>
              <ul className="list-disc ml-6">
                {ticketInfo.combo.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div> */}
              <div className="flex items-center pt-2 pb-2">
                <strong className="w-[25%]">Seats:</strong> <span>{ticketInfo.seats.join(", ")}</span>
              </div>
              <div className="flex items-center pt-2 pb-2">
                <strong className="w-[25%]">Price:</strong> <span>${ticketInfo.price} / SEAT * {ticketInfo.seats.length} </span>
              </div>
              <div className="flex items-center pt-2 pb-2">
                <strong className="w-[25%]">Discount:</strong>{" "}
                <span className="text-red-500">{ticketInfo.discount}</span>
              </div>
              <div className="flex items-center pt-2 pb-2">
                <strong className="w-[25%]">Score for ticket converting:</strong> <span>{ticketInfo.score}</span>
              </div>
            </div>
            <div className="flex items-center pt-2 pb-2">
              <strong className="w-[25%]">Total:</strong>{" "}
              <span className="text-green-600 font-bold">
                ${ticketInfo.totalAfterDiscount}
              </span>
            </div>
          </div>
        </Card>
        {/* Member */}
        <Card
          className="w-[30%] rounded-2xl shadow-md"
          title={
            <span className="font-bold text-lg">
              <i className="fa-solid fa-users mr-2"></i>Member
            </span>
          }
        >
          <div className="flex flex-col gap-2 text-base">
            <div className="flex items-center pt-2 pb-2">
              <strong className="w-[50%]" >Member ID:</strong> <span>{memberInfo.id}</span>
            </div>
            <div className="flex items-center pt-2 pb-2">
              <strong className="w-[50%]">Identity card:</strong> <span>{memberInfo.identity}</span>
            </div>
            <div className="flex items-center pt-2 pb-2">
              <strong className="w-[50%]">Full name:</strong> <span>{memberInfo.name}</span>
            </div>
            <div className="flex items-center pt-2 pb-2">
              <strong className="w-[50%]">Phone number:</strong> <span>{memberInfo.phone}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <Link to="/staff/ticket-selling">
          <Button

            style={{ backgroundColor: statusObj.backgroundColor, color: statusObj.btnColor, fontWeight: statusObj.font }}
            size="large"
            className={`px-8 font-bold ${statusObj.btnColor}`}
            icon={statusObj.btnIcon}
          >
            {statusObj.btn}
          </Button>
        </Link>
        <Link to="/staff/ticket-selling/view-ticket">
          <Button
            style={{ backgroundColor: "white", color: "#4F46E5", border: "1px solid #4F46E5" }}
            size="large"
            className="px-8 font-bold flex items-center gap-2"
            icon={<i className="fa-solid fa-eye"></i>}
          >
            View ticket
          </Button>
        </Link>
      </div>
    </div>
  );
}