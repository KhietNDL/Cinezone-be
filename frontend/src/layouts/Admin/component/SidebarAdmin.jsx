import React from "react";
import { MdOutlineAvTimer, MdMovieCreation, MdPeopleAlt } from "react-icons/md";
import { IoTicketSharp } from "react-icons/io5";
import { FaDoorOpen, FaTicket } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const SidebarAdmin = () => {
  const menu = [
    {
      label: "Over View",
      icon: <MdOutlineAvTimer size={20} />,
      to: "/admin/dashboard",
    },
    {
      label: "Employee Management",
      icon: <MdPeopleAlt size={20} />,
      to: "/admin/employees",
    },
    {
      label: "Cinema Room Management",
      icon: <FaDoorOpen size={20} />,
      to: "/admin/rooms",
    },
    {
      label: "Movie Management",
      icon: <MdMovieCreation size={20} />,
      to: "/admin/movies",
    },
    {
      label: "Promotion Management",
      icon: <FaTicket size={20} />,
      to: "/admin/promotions",
    },
    {
      label: "Ticket Booking Management",
      icon: <IoTicketSharp size={20} />,
      to: "/admin/bookings",
    },
  ];

  return (
    <div className="w-[20%] bg-white h-full rounded-[10px] shadow-md">
      <div className="flex flex-col gap-2 p-4">
        {menu.map((item) => (
          <NavLink
            to={item.to}
            key={item.label}
            className={({ isActive }) =>
              `font-bold text-[16px] p-2 rounded flex items-center transition-colors ${
                isActive
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            <div className="mr-2">{item.icon}</div> {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SidebarAdmin;
