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
import ConfirmPayment from "./layouts/User/component/ConfirmPayment";
import ConfirmTicketsPage from "./layouts/Staff/component/ConfirmTicketsPage";
import MoviePromotions from "./layouts/User/component/PromotionPage";
import MovieManagement from "./layouts/Admin/component/MovieManagement";
import { AuthProvider } from "./context/AuthContext";
import ComboPage from "./layouts/Staff/component/ComboPage";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<MovieTheaterLogin />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/verification" element={<EmailVerification />} />
          <Route path="/:idMovie" element={<BookingPage />} />
          <Route path="/confirmPayment" element={<ConfirmPayment />} />
          <Route path="/promotions" element={<MoviePromotions />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="movies" element={<MovieManagement />} />
        </Route>

        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<SellTicketPage />} />
          <Route path="/staff/ticket-selling" element={<SellTicketPage />} />
          <Route path="/staff/movie-info" element={<SellTicketPage />} />
          <Route path="/staff/combos" element={<SellTicketPage />} />
          <Route
            path="/staff/ticket-selling/select-seats"
            element={<SelectSeatsPage />}
          />
          <Route
            path="/staff/ticket-selling/confirm-ticket"
            element={<ConfirmTicketsPage />}
          />
          <Route path="/staff/combo-selling" element={<ComboPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
