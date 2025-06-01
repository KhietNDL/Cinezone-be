import React from "react";
import { FaTicket } from "react-icons/fa6";
import { IoCalendar } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdMovieFilter } from "react-icons/md";
const DashboardAdmin = () => {
  return (
    <div className="p-[20px] flex items-center justify-between w-[80%]">
      <div className="w-[70%] space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3  w-[23%] shadow-md ">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Tickets Sold</p>

              <div className="p-2 bg-amber-50 rounded-full">
                <FaTicket size={20} color="gold" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Tickets Sold</p>

              <div className="p-2 bg-rose-50 rounded-full">
                <RiMoneyDollarCircleFill size={20} color="red" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Tickets Sold</p>

              <div className="p-2 bg-amber-50 rounded-full">
                <MdMovieFilter size={20} color="gold" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Tickets Sold</p>

              <div className="p-2 bg-rose-50 rounded-full">
                <IoCalendar size={20} color="red" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
        </div>
        <div className="bg-white w-full h-[250px] rounded-[10px] p-3 font-bold shadow-md">
          {" "}
          Sale Overview
        </div>
        <div className=" w-full h-[230px] flex items-center justify-between">
          <div className="bg-white w-[48%] h-full rounded-[10px] p-3 font-bold shadow-md">
            Chart
          </div>
          <div className="bg-white w-[48%] h-full rounded-[10px] p-3 font-bold shadow-md">
            Chart
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-[30%]">
        <div className="bg-white p-5 px-10 rounded-[20px] space-y-4 shadow-md">
          <p className="font-bold">Top 5 Movies by Ticket Sales</p>
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-[14px]">Poster title</p>
              <p className="text-slate-500 text-[14px]">Tickets</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay</p>
              </div>
              <p>3,210</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay</p>
              </div>
              <p>3,210</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay</p>
              </div>
              <p>3,210</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay</p>
              </div>
              <p>3,210</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay quá...</p>
              </div>
              <p>3,210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
