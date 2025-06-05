import React from "react";
import { MdOutlineAvTimer, MdMovieCreation, MdPeopleAlt } from "react-icons/md";
import { IoTicketSharp } from "react-icons/io5";
import { GiPopcorn } from "react-icons/gi";
import { FaDoorOpen, FaTicket, FaChartLine } from "react-icons/fa6";
import { NavLink } from "react-router-dom";


const SidebarStaff = () => {
  const menu = [
    {
      label: "Movie",
      icon: <i className="fa-solid fa-film"></i>,
      to: "/staff/movie-info",
    },
    {
      label: "Ticket Selling",
      icon: <i className="fa-solid fa-ticket"></i>,
      to: "/staff/ticket-selling",
    },
    {
      label: "Rooms",
      icon: <FaDoorOpen size={20} />,
      to: "/staff/rooms",
    },
    {
      label: "Combos",
      icon: <GiPopcorn />,
      to: "/staff/combos",
    },
    {
      label: "Reports",
      icon: <FaChartLine />,
      to: "/staff/reports",
    },
    
      
  ];

  return (
    <div className="w-full bg-white h-full rounded-[10px] shadow-md">
      <div className="flex flex-col gap-2 p-4">
        {menu.map((item) => (
          <NavLink
            to={item.to}
            key={item.label}
            className={({ isActive }) =>
              ` text-[16px] p-2 rounded flex items-center transition-colors ${
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

export default SidebarStaff;