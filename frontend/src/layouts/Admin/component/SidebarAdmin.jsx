import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineAvTimer, MdMovieCreation, MdPeopleAlt } from "react-icons/md";
import { IoTicketSharp } from "react-icons/io5";
import { FaDoorOpen, FaTicket, FaUser } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";

const SidebarAdmin = ({ isOpen, onToggle }) => {
  const menu = [
    {
      label: "Dashboard",
      icon: <MdOutlineAvTimer />,
      to: "/admin/dashboard",
      end: true, // Chỉ active khi đúng chính xác route
    },
    {
      label: "User ",
      icon: <FaUser />,
      to: "/admin/users",
    },
    {
      label: "Employee ",
      icon: <MdPeopleAlt />,
      to: "/admin/employees",
    },
    {
      label: "Movie ",
      icon: <MdMovieCreation />,
      to: "/admin/movies",
    },
    {
      label: "Cinema Room ",
      icon: <FaDoorOpen />,
      to: "/admin/rooms",
    },
    {
      label: "Ticket Booking ",
      icon: <IoTicketSharp />,
      to: "/admin/bookings",
    },
    {
      label: "Product ",
      icon: <AiOutlineProduct />,
      to: "/admin/products",
    },
    {
      label: "Promotion ",
      icon: <FaTicket />,
      to: "/admin/promotions",
    },
  ];

  return (
    <>
      {/* Overlay for mobile and tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 md:bg-black/20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 select-none shrink-0 left-0 h-full bg-white shadow-lg z-50 w-[260px] md:w-[308px] transform transition-transform duration-300 ease-in-out
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:block`}
      >
        {/* Close button for mobile and tablet */}
        <div className="flex justify-end p-4 md:p-6 lg:hidden">
          <button
            onClick={onToggle}
            className="p-2 md:p-3 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <FaTimes size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 md:p-6 pt-0 lg:pt-4 md:lg:pt-6">
          <nav className="space-y-2 md:space-y-3">
            {menu.map((item) => (
              <NavLink
                to={item.to}
                end={item.end} // Sử dụng thuộc tính end nếu có
                key={item.label}
                className={({ isActive }) =>
                  `flex items-center space-x-3 md:space-x-4 px-4 md:px-6 py-3 md:py-4 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-purple-100 text-purple-700 border-l-4 border-purple-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={() => onToggle && onToggle()}
              >
                <span className="text-lg md:text-xl">{item.icon}</span>
                <span className="font-medium md:text-lg">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;
