import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { logoutUser, refreshSession } from "../api/services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSignedIn = !!user;

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await refreshSession();
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        sessionStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const [hasInvitations, setHasInvitations] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isSignedIn,
        isLoading,
        logout,
        hasInvitations,
        setHasInvitations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
