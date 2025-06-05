import { Route, Routes } from "react-router-dom";
import "./App.css";

import LandingPage from "./layouts/User/component/Landing";
import Login from "./auth/login/Login";
import AdminLayout from "./layouts/Admin/AdminLayout";
import UserLayout from "./layouts/User/UserLayout";
import DashboardAdmin from "./layouts/Admin/component/DashboardAdmin";

import SellTicketPage from "./layouts/Staff/component/SellTicketPage";
import "tailwindcss";
import StaffLayout from "./layouts/Staff/StaffLayout";
import SelectSeatsPage from "./layouts/Staff/component/SelectSeatsPage";
function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/admin/dashboard" element={<AdminLayout />}>
        <Route index path="/admin/dashboard" element={<DashboardAdmin />} />
      </Route>

      <Route path="/staff" element={<StaffLayout />}>
        <Route index path="/staff/ticket-selling" element={<SellTicketPage />} />
        <Route path="/staff/ticket-selling" element={<SellTicketPage />} />  
        <Route path="/staff/movie-info" element={<SellTicketPage />} />
        <Route path="/staff/rooms" element={<SellTicketPage />} />  
        <Route path="/staff/combos" element={<SellTicketPage />} />
        <Route path="/staff/reports" element={<SellTicketPage />} />
        <Route path="/staff/select-seats" element={<SelectSeatsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
