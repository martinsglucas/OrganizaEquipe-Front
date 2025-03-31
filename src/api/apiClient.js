import axios from "axios";
import { logoutUser } from "./services/userService";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logoutUser();
      toast.warn("Sessão expirada. Faça login novamente.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
