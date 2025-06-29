import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [showNoAccess, setShowNoAccess] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      const decoded = jwtDecode(localStorage.getItem("token"));
      if (!allowedRoles.includes(decoded.role)) {
        setShowNoAccess(true);
        const timer = setTimeout(() => {
          if (decoded.role === 3)
            navigate("/admin/dashboard", { replace: true });
          else if (decoded.role === 2) navigate("/staff", { replace: true });
          else navigate("/", { replace: true });
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, user, allowedRoles, navigate]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600 mb-4"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <div className="font-semibold text-lg text-indigo-700">
            Loading, please wait...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const decoded = jwtDecode(localStorage.getItem("token"));
  if (!allowedRoles.includes(decoded.role)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
          <div className="text-2xl font-bold text-red-500 mb-2">
            Access Denied
          </div>
          <div className="text-gray-700 mb-4">
            You do not have permission to access this page.
            <br />
            Redirecting you to your dashboard...
          </div>
        </div>
      </div>
    );
  }

  let LayoutComponent;
  if (decoded.role === 3) LayoutComponent = "AdminLayout";
  else if (decoded.role === 2) LayoutComponent = "StaffLayout";
  else if (decoded.role === 1) LayoutComponent = "UserLayout";

  return <Outlet context={{ LayoutComponent }} />;
};

export default ProtectedRoute;
