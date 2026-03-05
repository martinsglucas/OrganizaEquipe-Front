import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

// ---

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const isRefreshRoute = originalRequest.url?.includes("token/refresh");
    const alreadyRetried = originalRequest._retry;

    if (!is401 || isRefreshRoute || alreadyRetried) {
      if (is401) {
        _handleLogout();
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/token/refresh/`,
        {},
        { withCredentials: true },
      );

      const newToken = data.access;
      setAccessToken(newToken);

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      _handleLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

function _handleLogout() {
  clearAccessToken();
  toast.warn("Sessão expirada. Faça login novamente.");
  setTimeout(() => {
    window.location.href = "/login";
  }, 2000);
}

export default apiClient;
