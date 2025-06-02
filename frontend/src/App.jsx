import { Route, Routes } from "react-router-dom";
import "./App.css";

import LandingPage from "./layouts/User/component/Landing";
import Login from "./auth/login/Login";
import AdminLayout from "./layouts/Admin/AdminLayout";
import UserLayout from "./layouts/User/UserLayout";
import DashboardAdmin from "./layouts/Admin/component/DashboardAdmin";
import EmployeeManagement from "./layouts/Admin/component/EmployeeManagement";

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="employees" element={<EmployeeManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
