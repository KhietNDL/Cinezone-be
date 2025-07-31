import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { getUser, logout } from "../services/API";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const socketRef = useRef(null);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      if (!socketRef.current) {
        socketRef.current = io("http://localhost:4458");
        socketRef.current.emit("join", userId);
      }
      socketRef.current.off("force-logout");
      socketRef.current.on("force-logout", () => {
        // Không dùng async/await ở đây, chỉ gọi signOut()
        signOut();
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // Đừng để signOut trong dependency!
    // eslint-disable-next-line
  }, [user?.UserId]);

  const signIn = async (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    try {
      const userData = await getUser(userId);
      setUser(userData.user);
      return { success: true, user: userData.user };
    } catch (error) {
      console.error("Failed to fetch user in signIn:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(null);

      // Trả về object với thông tin lỗi
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
