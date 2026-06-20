import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  deactivatePushSubscription,
  upsertPushSubscription,
} from "../api/services/userService";
import { useAuth } from "./AuthContext";
import {
  detectIsIos,
  detectIsStandalone,
  getBrowserName,
  getBrowserNotificationPermission,
  getDeviceLabel,
  getFcmToken,
  getPlatformName,
  isMessagingSupported,
  registerMessagingServiceWorker,
  requestBrowserNotificationPermission,
  subscribeToForegroundMessages,
} from "../firebase";

const NotificationContext = createContext();
const LAST_PUSH_TOKEN_KEY = "lastPushSubscriptionToken";

const defaultState = {
  isSupported: false,
  isIos: false,
  isStandalone: false,
  permission: "default",
  isLoading: false,
  isEnabled: false,
  status: "idle",
  error: null,
};

const getSavedToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_PUSH_TOKEN_KEY);
};

const saveToken = (token) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_PUSH_TOKEN_KEY, token);
};

const clearSavedToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LAST_PUSH_TOKEN_KEY);
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState(defaultState);

  const readEnvironment = useCallback(async () => {
    const supported = await isMessagingSupported();
    const permission = getBrowserNotificationPermission();

    return {
      supported,
      permission,
      isIos: detectIsIos(),
      isStandalone: detectIsStandalone(),
    };
  }, []);

  const deactivateCurrentToken = useCallback(async (token) => {
    if (!token) return;

    try {
      await deactivatePushSubscription(token);
    } catch (error) {
      console.error("Erro ao desativar inscrição de notificações:", error);
    } finally {
      clearSavedToken();
    }
  }, []);

  const syncCurrentDevice = useCallback(async (environment) => {
    if (!user) return false;

    const currentEnvironment = environment || (await readEnvironment());
    if (!currentEnvironment.supported || currentEnvironment.permission !== "granted") {
      return false;
    }

    const registration = await registerMessagingServiceWorker();
    if (!registration) return false;

    const token = await getFcmToken(registration);
    if (!token) return false;

    const previousToken = getSavedToken();
    if (previousToken && previousToken !== token) {
      await deactivateCurrentToken(previousToken);
    }

    await upsertPushSubscription({
      token,
      platform: getPlatformName(),
      browser: getBrowserName(),
      device_label: getDeviceLabel(),
      is_ios: currentEnvironment.isIos,
      is_standalone: currentEnvironment.isStandalone,
      permission: currentEnvironment.permission,
      is_active: true,
    });

    saveToken(token);
    return true;
  }, [deactivateCurrentToken, readEnvironment, user]);

  const refreshNotificationStatus = useCallback(async () => {
    if (!user) {
      setState(defaultState);
      return;
    }

    setState((previous) => ({ ...previous, isLoading: true, error: null }));

    try {
      const environment = await readEnvironment();
      const nextState = {
        isSupported: environment.supported,
        isIos: environment.isIos,
        isStandalone: environment.isStandalone,
        permission: environment.permission,
        isLoading: false,
        error: null,
      };

      if (!environment.supported) {
        setState({
          ...nextState,
          isEnabled: false,
          status: "unsupported",
        });
        return;
      }

      if (environment.isIos && !environment.isStandalone) {
        setState({
          ...nextState,
          isEnabled: false,
          status: "install_required",
        });
        return;
      }

      if (environment.permission === "denied") {
        const savedToken = getSavedToken();
        if (savedToken) {
          await deactivateCurrentToken(savedToken);
        }

        setState({
          ...nextState,
          isEnabled: false,
          status: "permission_denied",
        });
        return;
      }

      if (environment.permission === "granted") {
        const synced = await syncCurrentDevice(environment);
        setState({
          ...nextState,
          isEnabled: synced,
          status: synced ? "enabled" : "error",
          error: synced ? null : "Não foi possível sincronizar este dispositivo.",
        });
        return;
      }

      setState({
        ...nextState,
        isEnabled: false,
        status: "ready_to_enable",
      });
    } catch (error) {
      console.error("Erro ao atualizar status de notificações:", error);
      setState((previous) => ({
        ...previous,
        isLoading: false,
        isEnabled: false,
        status: "error",
        error: "Não foi possível verificar o status das notificações.",
      }));
    }
  }, [deactivateCurrentToken, readEnvironment, syncCurrentDevice, user]);

  const enableNotifications = useCallback(async () => {
    if (!user) {
      toast.error("Faça login para ativar notificações.");
      return;
    }

    setState((previous) => ({
      ...previous,
      isLoading: true,
      status: "enabling",
      error: null,
    }));

    try {
      const environment = await readEnvironment();

      if (!environment.supported) {
        setState({
          ...defaultState,
          isSupported: false,
          status: "unsupported",
        });
        toast.warn("Este dispositivo não suporta notificações web.");
        return;
      }

      if (environment.isIos && !environment.isStandalone) {
        setState({
          isSupported: true,
          isIos: true,
          isStandalone: false,
          permission: environment.permission,
          isLoading: false,
          isEnabled: false,
          status: "install_required",
          error: null,
        });
        toast.info("No iPhone, adicione o app à Tela de Início antes de ativar notificações.");
        return;
      }

      const permission =
        environment.permission === "granted"
          ? "granted"
          : await requestBrowserNotificationPermission();

      if (permission !== "granted") {
        const nextStatus = permission === "denied" ? "permission_denied" : "ready_to_enable";

        if (permission === "denied") {
          const savedToken = getSavedToken();
          if (savedToken) {
            await deactivateCurrentToken(savedToken);
          }
        }

        setState({
          isSupported: environment.supported,
          isIos: environment.isIos,
          isStandalone: environment.isStandalone,
          permission,
          isLoading: false,
          isEnabled: false,
          status: nextStatus,
          error: null,
        });

        if (permission === "denied") {
          toast.warn("As notificações foram bloqueadas neste dispositivo.");
        }

        return;
      }

      const synced = await syncCurrentDevice({
        ...environment,
        permission,
      });

      if (!synced) {
        throw new Error("sync_failed");
      }

      setState({
        isSupported: environment.supported,
        isIos: environment.isIos,
        isStandalone: environment.isStandalone,
        permission,
        isLoading: false,
        isEnabled: true,
        status: "enabled",
        error: null,
      });
      toast.success("Notificações ativadas com sucesso!");
    } catch (error) {
      console.error("Erro ao ativar notificações:", error);
      setState((previous) => ({
        ...previous,
        isLoading: false,
        isEnabled: false,
        status: "error",
        error: "Não foi possível ativar as notificações neste dispositivo.",
      }));
      toast.error("Não foi possível ativar as notificações.");
    }
  }, [deactivateCurrentToken, readEnvironment, syncCurrentDevice, user]);

  const disableNotifications = useCallback(async () => {
    const savedToken = getSavedToken();
    await deactivateCurrentToken(savedToken);
    await refreshNotificationStatus();
  }, [deactivateCurrentToken, refreshNotificationStatus]);

  useEffect(() => {
    refreshNotificationStatus();
  }, [refreshNotificationStatus]);

  useEffect(() => {
    if (!user) return undefined;

    let unsubscribe = () => {};
    let cancelled = false;

    const setupForegroundListener = async () => {
      const supported = await isMessagingSupported();
      if (!supported || getBrowserNotificationPermission() !== "granted") {
        return;
      }

      const detach = await subscribeToForegroundMessages((payload) => {
        const { title, body } = payload.data || {};
        if (!title || !body) return;

        toast.info(`${title}: ${body}`, { autoClose: 5000 });
      });

      if (cancelled) {
        detach();
        return;
      }

      unsubscribe = detach;
    };

    setupForegroundListener();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [user]);

  const value = useMemo(() => ({
    ...state,
    enableNotifications,
    refreshNotificationStatus,
    disableNotifications,
  }), [disableNotifications, enableNotifications, refreshNotificationStatus, state]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
