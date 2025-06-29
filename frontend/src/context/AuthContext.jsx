import React, { createContext, useContext, useState, useEffect } from "react";
import { getUser, logout } from "../services/API";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded); // Set user tạm thời từ JWT

          const userData = await getUser(userId);
          setUser(userData.user);
        } catch (error) {
          console.error("Auth error:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      const userData = await getUser(userId);
      setUser(userData.user);
    } catch (error) {
      console.error("Failed to fetch user in signIn:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
