import React, { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../services/API";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log("Fetching user with token:", token); // Log token
      if (token) {
        try {
          const userData = await getUser();
          console.log("User data:", userData); // Log user data
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const signIn = async (token) => {
    console.log("signIn called with token:", token); // Log token
    localStorage.setItem("token", token);
    try {
      const userData = await getUser();
      console.log("User data from signIn:", userData); // Log user data
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user in signIn:", error);
      localStorage.removeItem("token");
    }
  };

  const signOut = () => {
    console.log("Signing out"); // Log sign out
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
