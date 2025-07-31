import React, { useState } from "react";
import HeaderStaff from "./component/HeaderStaff";
import { Outlet } from "react-router-dom";
import SidebarStaff from "./component/SidebarStaff";

const StaffLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="w-full bg-[#f9f9f9] h-screen">
      <HeaderStaff
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex items-start h-[calc(100vh_-_6.1rem)]">
        <SidebarStaff
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(false)}
        />
        <div className="overflow-y-auto h-full p-4 w-full lg:ml-0">
          {/* Scroll to Top Button */}

          <Outlet />
          
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;
