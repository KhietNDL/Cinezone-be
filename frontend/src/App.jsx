import { Route, Routes } from "react-router-dom";
import "./App.css";

import LandingPage from "./layouts/User/component/Landing";

import AdminLayout from "./layouts/Admin/AdminLayout";
import UserLayout from "./layouts/User/UserLayout";
import DashboardAdmin from "./layouts/Admin/component/DashboardAdmin";
import MovieTheaterLogin from "./auth/login/Login";
import RegistrationPage from "./auth/register/Register";
import ForgotPasswordPage from "./auth/forgot/ForgotPassword";
import EmailVerification from "./auth/verification/VerificationPassword";
import BookingPage from "./layouts/User/component/BookingPage";
import EmployeeManagement from "./layouts/Admin/component/EmployeeManagement";
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
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="employees" element={<EmployeeManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
