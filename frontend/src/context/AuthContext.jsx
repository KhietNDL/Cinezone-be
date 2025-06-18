import React, { createContext, useContext, useState, useEffect } from "react";
import { getUser, logout } from "../services/API";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        try {
          const userData = await getUser(userId);
          setUser(userData.user);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setUser(null); // <- thêm dòng này
        }
      } else {
        setUser(null); // <- thêm dòng này nếu không có token
      }

      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const signIn = async (token, userId) => {
    console.log("signIn called with token:", token); // Log token
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId); // lưu id vào
    try {
      const userData = await getUser(userId);
      console.log("User data from signIn:", userData); // Log user data
      setUser(userData.user);
    } catch (error) {
      console.error("Failed to fetch user in signIn:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      await logout(); // gọi API logout

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Dù lỗi vẫn xóa local data để đảm bảo logout sạch
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
