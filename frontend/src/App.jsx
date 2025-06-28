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
import TicketInfomation from "./layouts/Staff/component/TicketInfomation";
import PrintTicket from "./layouts/Staff/component/PrintTicket";
import RoomManagement from "./layouts/Admin/component/RoomManagement";
import { ToastContainer } from "react-toastify";
import WaitingPayment from "./layouts/User/component/WaitingPayment";

import AccountImformation from "./layouts/User/component/AccountImformation";
import EditAccount from "./layouts/User/component/EditAccount";
import HistoryActivity from "./layouts/User/component/HistoryActivity";

import TicketBookingManagement from "./layouts/Admin/component/TicketBookingMangement";
import PromotionManagement from "./layouts/Admin/component/PromotionManagement";
import ResetPassword from "./auth/resetPassword/resetPassword";

import { UserManagement } from "./layouts/Admin/component/UserManagement";
import MoviePage from "./layouts/Staff/component/MoviePage";
import MovieDetail from "./layouts/Staff/component/MovieDetail";
import TicketDetails from "./layouts/User/component/TicketDetails";
import GoogleCallback from "./auth/login/GoogleCallback";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:slug" element={<BookingPage />} />

          <Route path="/login" element={<MovieTheaterLogin />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/login/google/callback" element={<GoogleCallback />} />
          <Route path="/verification" element={<EmailVerification />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/:idMovie" element={<BookingPage />} />
          <Route path="/ticket" element={<TicketDetails />} />
          <Route path="/confirmPayment" element={<ConfirmPayment />} />
          <Route path="/promotions" element={<MoviePromotions />} />
          <Route path="/waiting" element={<WaitingPayment />} />

          <Route path="/account" element={<AccountImformation />}>
            <Route path="*" element={<AccountImformation />} />
            <Route path="personal" element={<EditAccount />} />
            <Route path="history" element={<HistoryActivity />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="movies" element={<MovieManagement />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="bookings" element={<TicketBookingManagement />} />
          <Route path="promotions" element={<PromotionManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<SellTicketPage />} />
          <Route path="/staff/ticket-selling" element={<SellTicketPage />} />
          <Route path="/staff/movie" element={<MoviePage />} />
          <Route path="/staff/movie/:slug" element={<MovieDetail />} />
          <Route
            path="/staff/ticket-selling/select-seats"
            element={<SelectSeatsPage />}
          />
          <Route
            path="/staff/ticket-selling/confirm-ticket"
            element={<ConfirmTicketsPage />}
          />
          <Route
            path="/staff/ticket-selling/ticket-infomation"
            element={<TicketInfomation />}
          />
          <Route path="/staff/combo-selling" element={<ComboPage />} />
          <Route
            path="/staff/ticket-selling/view-ticket"
            element={<PrintTicket />}
          />
        </Route>
      </Routes>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
