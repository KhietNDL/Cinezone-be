import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { PiPopcornDuotone } from "react-icons/pi";
import { BsQrCodeScan } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";

const SidebarStaff = () => {
  const [open, setOpen] = useState(false);

  const menu = [
    {
      label: "Movie",
      icon: <i className="fa-solid fa-film"></i>,
      to: "/staff/movie",
    },
    {
      label: "Ticket Selling",
      icon: <i className="fa-solid fa-ticket"></i>,
      to: "/staff/ticket-selling",
    },
    {
      label: "Combo Food",
      icon: <PiPopcornDuotone />,
      to: "/staff/combo-selling",
    },
     {
      label: "Check-in",
      icon: <BsQrCodeScan />,
      to: "/staff/check-in",
    },
  ];

  return (
    <>
      {/* Nút mở sidebar trên mobile */}
      <button
        className="block md:hidden fixed top-25 left-4 z-50 bg-purple-600 text-white p-2 rounded"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <FaBars size={24} />
      </button>
      {/* Overlay khi mở sidebar trên mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 border-r border-gray-200 bg-white rounded-r-[10px] shadow-md z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        {/* Nút đóng sidebar trên mobile */}
        <div className="flex justify-end md:hidden p-2">
          <button
            className="text-purple-600 text-2xl"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div>
            <h1 className="text-[20px] font-bold text-purple-600">Hello Staff!</h1>
            <p className="text-[14px] text-gray-500">Manage your cinema</p>
          </div>
          {menu.map((item) => (
            <NavLink
              to={item.to}
              key={item.label}
              className={({ isActive }) =>
                `text-[16px] p-2 rounded flex items-center transition-colors ${
                  isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-800 hover:bg-gray-100"
                }`
              }
              onClick={() => setOpen(false)} 
            >
              <div className="mr-2">{item.icon}</div> {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default SidebarStaff;