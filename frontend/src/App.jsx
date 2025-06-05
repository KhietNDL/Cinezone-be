import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./layouts/User/component/Landing";
import AdminLayout from "./layouts/Admin/AdminLayout";
import UserLayout from "./layouts/User/UserLayout";
import DashboardAdmin from "./layouts/Admin/component/DashboardAdmin";
import MovieTheaterLogin from "./auth/login/Login";
import RegistrationPage from "./auth/register/Register";
import ForgotPasswordPage from "./auth/forgot/ForgotPassword";
import EmailVerification from "./auth/verification/VerificationPassword";
import EmployeeManagement from "./layouts/Admin/component/EmployeeManagement";
import BookingPage from "./layouts/User/component/BookingPage";

import SellTicketPage from "./layouts/Staff/component/SellTicketPage";
import "tailwindcss";
import StaffLayout from "./layouts/Staff/StaffLayout";
import SelectSeatsPage from "./layouts/Staff/component/SelectSeatsPage";
function App() {
  return (
    
    <Routes>
      

      <Route element={<UserLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<MovieTheaterLogin />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/verification" element={<EmailVerification />} />
        <Route path="/:idMovie" element={<BookingPage />} />
          <Route path="/confirmPayment" element={<ConfirmPayment />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="employees" element={<EmployeeManagement />} />
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
