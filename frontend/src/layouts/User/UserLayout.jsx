import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";

const UserLayout = () => {
  const location = useLocation();
<<<<<<< HEAD
  const hideHeaderFooter = location.pathname === "/login";

  return (
    <div className="relative w-full bg-slate-900">
=======
  const hideHeaderFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot" ||
    location.pathname === "/verification";

  return (
    <div className="relative w-full bg-black">
>>>>>>> Develop
      {!hideHeaderFooter && <Header />}
      <Outlet />
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default UserLayout;
