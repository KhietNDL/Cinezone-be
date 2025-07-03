import React, { useState } from "react";
import HeaderAdmin from "./component/HeaderAdmin";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./component/SidebarAdmin"; // Đảm bảo đúng tên component

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="w-full bg-[#f9f9f9] h-screen">
      <HeaderAdmin
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex items-start h-[calc(100vh_-_5.4rem)]">
        <div
          className={`
            h-full shrink-0 select-none
            absolute z-50 top-0 left-0
            transition-transform duration-300
            bg-white
            w-[260px] md:w-[308px]
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:static lg:translate-x-0
          `}
        >
          <SidebarAdmin onClose={() => setIsSidebarOpen(false)} />
        </div>
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className="overflow-y-auto h-full p-4 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
