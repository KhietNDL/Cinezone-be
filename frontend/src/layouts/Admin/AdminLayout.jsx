import React from "react";
import HeaderAdmin from "./component/HeaderAdmin";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./component/SidebarAdmin";

const AdminLayout = () => {
  return (
    <div className="w-full bg-[#f9f9f9] h-screen">
      <HeaderAdmin />
      <div className="flex items-start h-[calc(100vh_-_5.4rem)]">
        <SidebarAdmin />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
