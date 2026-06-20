import apiClient, { setAccessToken, clearAccessToken } from "../apiClient";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const getUsers = async () => {
  const response = await apiClient.get("users/");
  return response.data;
};

export const getUser = async (id) => {
  const response = await apiClient.get(`users/${id}/`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await apiClient.post("users/", userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await apiClient.patch(`users/${id}/`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`users/${id}/`);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post("token/", credentials);

  const { access, user } = response.data;

  setAccessToken(access);
  localStorage.setItem("user", JSON.stringify(user));

  return { user };
};

export const logoutUser = () => {
  try {
    apiClient.post("token/logout/");
  } catch {
  } finally {
    clearAccessToken();
    localStorage.removeItem("user");
  }
};

export const getInvitations = async (id) => {
  const response = await apiClient.get(`users/${id}/get_invitations/`);
  return response.data;
};

export const refreshSession = async () => {
  const response = await axios.post(
    `${BASE_URL}/token/refresh/`,
    {},
    { withCredentials: true },
  );
  const { access } = response.data;
  setAccessToken(access);
  return access;
};

export const saveFcmToken = async (token) => {
  try {
    const response = await apiClient.post("users/fcm_token/", {
      fcm_token: token,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar FCM token:", error);
  }
};

export const upsertPushSubscription = async (payload) => {
  const response = await apiClient.post("push_subscriptions/", payload);
  return response.data;
};

export const listPushSubscriptions = async () => {
  const response = await apiClient.get("push_subscriptions/");
  return response.data?.results || response.data;
};

export const deactivatePushSubscription = async (token) => {
  const response = await apiClient.post("push_subscriptions/deactivate/", { token });
  return response.data;
};
