import React from "react";
import HeaderStaff from "./component/HeaderStaff";
import SidebarStaff from "./component/SidebarStaff";
import { Outlet } from "react-router-dom";


const StaffLayout = () => {
  return (
    <div className="w-full bg-[#f9f9f9] h-screen">
      <HeaderStaff />
      <div className="flex items-start h-[calc(100vh_-_4.5rem)]">
        
        <div className="h-full w-[250px] shrink-0"><SidebarStaff /></div>
       <div className="h-full overflow-y-auto w-full"><Outlet /></div> 
      </div>
    </div>
  );
};

export default StaffLayout;