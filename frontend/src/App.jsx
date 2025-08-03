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

import SellTicketPage from "./layouts/Staff/ticketComponent/SellTicketPage";
import "tailwindcss";
import StaffLayout from "./layouts/Staff/StaffLayout";
import SelectSeatsPage from "./layouts/Staff/ticketComponent/SelectSeatsPage";
import ConfirmPayment from "./layouts/User/component/ConfirmPayment";
import ComboPage from "./layouts/Staff/foodComponent/ComboPage";
import TicketInformation from "./layouts/Staff/ticketComponent/TicketInformation";
import PrintTicket from "./layouts/Staff/ticketComponent/PrintTicket";
import ConfirmTicketsPage from "./layouts/Staff/ticketComponent/confirmTicketsPage/ConfirmTicketsPage";
import MoviePage from "./layouts/Staff/movieComponent/MoviePage";
import MovieDetail from "./layouts/Staff/movieComponent/MovieDetail";
import CheckOutComboPage from "./layouts/Staff/foodComponent/CheckOutComboPage";
import ComboInformation from "./layouts/Staff/foodComponent/ComboInformation";
import CheckIn from "./layouts/Staff/ticketComponent/CheckIn";

import MoviePromotions from "./layouts/User/component/PromotionPage";
import MovieManagement from "./layouts/Admin/component/MovieManagement";
import { AuthProvider } from "./context/AuthContext";

import RoomManagement from "./layouts/Admin/component/RoomManagement";
import { ToastContainer } from "react-toastify";
import WaitingPayment from "./layouts/User/component/WaitingPayment";

import AccountImformation from "./layouts/User/component/AccountImformation";
import EditAccount from "./layouts/User/component/EditAccount";
import HistoryActivity from "./layouts/User/component/HistoryActivity";

import TicketBookingManagement from "./layouts/Admin/component/TicketBookingMangement";
import PromotionManagement from "./layouts/Admin/component/PromotionManagement";
import ResetPassword from "./auth/resetPassword/ResetPassword";

import UserManagement from "./layouts/Admin/component/UserManagement";
import TicketDetails from "./layouts/User/component/TicketDetails";
import GoogleCallback from "./auth/login/GoogleCallback";
import ProtectedRoute from "./routes/ProtectedRoute";

import { ConfigProvider } from "antd";
import ProductManagement from "./layouts/Admin/component/ProductManagement";
import MovieListPage from "./layouts/User/component/MovieListPage";
import BlogPage from "./layouts/User/component/BlogPage";
import BlogDetail from "./layouts/User/component/BlogDetail";
import NotFound from "../cosmic/blocks/blog/NotFound";
import WaitingPaymentStaff from "./layouts/Staff/ticketComponent/WaitingPaymentStaff";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<MovieTheaterLogin />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/verification" element={<EmailVerification />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        <Route element={<ProtectedRoute allowedRoles={[1]} />}>
          <Route element={<UserLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/:slug" element={<BookingPage />} />
            <Route path="/:idMovie" element={<BookingPage />} />
            <Route path="/ticket" element={<TicketDetails />} />
            <Route path="/confirmPayment" element={<ConfirmPayment />} />
            <Route path="/promotions" element={<MoviePromotions />} />
            <Route path="/waiting" element={<WaitingPayment />} />
            <Route path="/movies" element={<MovieListPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/account" element={<AccountImformation />}>
              <Route path="*" element={<AccountImformation />} />
              <Route path="personal" element={<EditAccount />} />
              <Route path="history" element={<HistoryActivity />} />
            </Route>
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={[3]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="movies" element={<MovieManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="bookings" element={<TicketBookingManagement />} />
            <Route path="promotions" element={<PromotionManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[2]} />}>
          <Route
            path="/staff"
            element={
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#8A2BE2",
                  },
                }}
              >
                <StaffLayout />
              </ConfigProvider>
            }
          >
            <Route index element={<SellTicketPage />} />
            <Route path="ticket-selling" element={<SellTicketPage />} />
            <Route path="movie" element={<MoviePage />} />
            <Route path="movie/:slug" element={<MovieDetail />} />
            <Route
              path="ticket-selling/select-seats"
              element={<SelectSeatsPage />}
            />
            <Route
              path="ticket-selling/confirm-ticket"
              element={<ConfirmTicketsPage />}
            />
            <Route
              path="ticket-selling/waiting-payment"
              element={<WaitingPaymentStaff />}
            />
            <Route
              path="ticket-selling/ticket-information"
              element={<TicketInformation />}
            />
            <Route
              path="ticket-selling/view-ticket/:id"
              element={<PrintTicket />}
            />
            <Route path="combo-selling" element={<ComboPage />} />
            <Route
              path="combo-selling/checkout"
              element={<CheckOutComboPage />}
            />
            <Route
              path="combo-selling/waiting-payment"
              element={<WaitingPaymentStaff />}
            />
            <Route
              path="combo-selling/combo-information"
              element={<ComboInformation />}
            />
            <Route path="check-in" element={<CheckIn />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
