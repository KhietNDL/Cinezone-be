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
      <div className="flex items-start h-[calc(100vh_-_6.1rem)]">
        <SidebarAdmin
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(false)}
        />
        <div className="overflow-y-auto h-full p-4 w-full lg:ml-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
