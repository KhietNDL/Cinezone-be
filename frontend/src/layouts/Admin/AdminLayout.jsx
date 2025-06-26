import React from "react";
import HeaderAdmin from "./component/HeaderAdmin";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./component/SidebarAdmin";

const AdminLayout = () => {
  return (
    <div className="w-full bg-[#f9f9f9] h-screen">
      <HeaderAdmin />
      <div className="flex items-start h-[calc(100vh_-_5.4rem)]">
        <div className="w-[308px] h-full shrink-0 select-none">
          <SidebarAdmin />
        </div>
        <div className=" overflow-y-auto h-full p-4 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
