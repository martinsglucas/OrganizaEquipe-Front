import { createContext, useContext, useEffect, useState } from "react";
import { logoutUser, verifyToken } from "../api/services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isSignedIn = !!user;

  useEffect(() => {
    const checkTokenValidity = async () => {
      const isValid = await verifyToken();
      if (!isValid) {
        console.log("Token expirado! Fazendo logout...");
        logoutUser();
      } else {
        const storedUser = sessionStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      }
    };

    checkTokenValidity();
  }, []);


  return (
    <AuthContext.Provider
      value={{ user, setUser, isSignedIn, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}