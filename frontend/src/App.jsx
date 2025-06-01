import { Route, Routes } from "react-router-dom";
import "./App.css";

import LandingPage from "./layouts/User/component/Landing";
import Login from "./auth/login/Login";
import AdminLayout from "./layouts/Admin/AdminLayout";
import UserLayout from "./layouts/User/UserLayout";
import DashboardAdmin from "./layouts/Admin/component/DashboardAdmin";

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
    </Routes>
  );
}

export default App;
