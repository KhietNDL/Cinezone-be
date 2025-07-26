import React from "react";
import { MdOutlineAvTimer, MdMovieCreation, MdPeopleAlt } from "react-icons/md";
import { IoTicketSharp } from "react-icons/io5";
import { FaDoorOpen, FaTicket, FaUser } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { AiOutlineProduct } from "react-icons/ai";
const SidebarAdmin = ({ onClose }) => {
  const menu = [
    {
      label: "Over View",
      icon: <MdOutlineAvTimer size={20} />,
      to: "/admin/dashboard",
    },
    {
      label: "User Management",
      icon: <FaUser size={20} />,
      to: "/admin/users",
    },
    {
      label: "Employee Management",
      icon: <MdPeopleAlt size={20} />,
      to: "/admin/employees",
    },
    {
      label: "Movie Management",
      icon: <MdMovieCreation size={20} />,
      to: "/admin/movies",
    },
    {
      label: "Cinema Room Management",
      icon: <FaDoorOpen size={20} />,
      to: "/admin/rooms",
    },
    {
      label: "Ticket Booking Management",
      icon: <IoTicketSharp size={20} />,
      to: "/admin/bookings",
    },
    {
      label: "Product Management",
      icon: <AiOutlineProduct size={20} />,
      to: "/admin/products",
    },
    {
      label: "Promotion Management",
      icon: <FaTicket size={20} />,
      to: "/admin/promotions",
    },
    {
      label: "Blog Management",
      icon: <MdMovieCreation size={20} />,
      to: "/admin/blogs",
    },
  ];

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div
      className={`
        h-full w-[260px] md:w-[308px] bg-white shadow-md
        flex flex-col z-50 items-start rounded-br-2xl rounded-bl-2xl
      `}
    >
      {/* Mobile: Header with close button */}
      <div className="lg:hidden flex items-center justify-between border-gray-200 p-4 border-b w-full">
        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="close menu"
        >
          <X size={20} />
        </button>
      </div>
      {/* Menu */}
      <div className="flex flex-col gap-2 p-4 w-full">
        {menu.map((item) => (
          <NavLink
            to={item.to}
            key={item.label}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `font-bold text-[14px] md:text-[16px] p-3 md:p-2 rounded flex items-center transition-all duration-200 transform hover:scale-105 ${
                isActive
                  ? "bg-purple-100  text-purple-600"
                  : "text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            <div className="mr-3 md:mr-2 flex-shrink-0">{item.icon}</div>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SidebarAdmin;
