import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect, useCallback } from "react";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading, signOut } = useAuth();
  const location = useLocation();

  // Check if it's landing route "/"
  const isLandingRoute = location.pathname === "/";
  const token = localStorage.getItem("token");
  let decoded = {};

  // Function to check token expiration
  const checkTokenExpiration = useCallback(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      try {
        const decodedToken = jwtDecode(currentToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.log("Token has expired, logging out...");
          signOut();
          return true; // Token expired
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        signOut();
        return true; // Invalid token
      }
    }
    return false; // Token is valid or doesn't exist
  }, [signOut]);

  // Set up periodic token check (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 5 * 60 * 1000); // Check every 5 minutes

    // Also check when component mounts
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  if (token) {
    try {
      decoded = jwtDecode(token);

      // Check if token is expired
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decoded.exp && decoded.exp < currentTime) {
        console.log("Token has expired, logging out...");
        // Token expired, perform logout
        signOut();
        return <Navigate to="/login" replace />;
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      signOut();
      return <Navigate to="/login" replace />;
    }
  }

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

  // If not logged in and not landing page, redirect to login
  if (!user && !isLandingRoute) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If not logged in but on landing page, allow access
  if (!user && isLandingRoute) {
    return <Outlet context={{ LayoutComponent: "UserLayout" }} />;
  }

  // If logged in, check token and access permissions
  if (user && token) {
    // Allow everyone to access landing page
    if (isLandingRoute) {
      // Let everyone access the landing page, use UserLayout for consistent experience
      return <Outlet context={{ LayoutComponent: "UserLayout" }} />;
    }

    // If not landing route and role doesn't match
    if (!isLandingRoute && !allowedRoles.includes(decoded.role)) {
      if (decoded.role === 3) return <Navigate to="/admin/dashboard" replace />;
      if (decoded.role === 2) return <Navigate to="/staff" replace />;
      return <Navigate to="/" replace />;
    }
  } // Determine layout component based on role
  let LayoutComponent;
  if (user && token && decoded.role) {
    if (decoded.role === 3) LayoutComponent = "AdminLayout";
    else if (decoded.role === 2) LayoutComponent = "StaffLayout";
    else if (decoded.role === 1) LayoutComponent = "UserLayout";
  } else {
    // Default to UserLayout for guests or users without valid token
    LayoutComponent = "UserLayout";
  }

  return <Outlet context={{ LayoutComponent }} />;
};

export default ProtectedRoute;
