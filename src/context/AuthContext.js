import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { logoutUser, refreshSession, saveFcmToken } from "../api/services/userService";
import { requestNotificationPermission } from "../firebase";

const AuthContext = createContext();
const LAST_FCM_TOKEN_KEY = "lastSavedFcmToken";
const LAST_FCM_TOKEN_USER_ID_KEY = "lastSavedFcmTokenUserId";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSignedIn = !!user;

  const registerPushToken = useCallback(async (currentUser) => {
    if (!currentUser?.id) return;

    const token = await requestNotificationPermission();
    if (!token) return;

    const lastSavedToken = localStorage.getItem(LAST_FCM_TOKEN_KEY);
    const lastSavedUserId = localStorage.getItem(LAST_FCM_TOKEN_USER_ID_KEY);

    if (
      lastSavedToken === token &&
      lastSavedUserId === String(currentUser.id)
    ) {
      return;
    }

    const response = await saveFcmToken(token);
    if (!response) return;

    localStorage.setItem(LAST_FCM_TOKEN_KEY, token);
    localStorage.setItem(LAST_FCM_TOKEN_USER_ID_KEY, String(currentUser.id));
  }, []);

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

  useEffect(() => {
    if (!user) return;

    registerPushToken(user);
  }, [user, registerPushToken]);

  const logout = useCallback(async () => {
    await logoutUser();
    localStorage.removeItem(LAST_FCM_TOKEN_KEY);
    localStorage.removeItem(LAST_FCM_TOKEN_USER_ID_KEY);
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
