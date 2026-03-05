import apiClient, { setAccessToken, clearAccessToken } from "../apiClient";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

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
  sessionStorage.setItem("user", JSON.stringify(user));

  return { user };
};

export const logoutUser = () => {
  try {
    apiClient.post("token/logout/");
  } catch {
  } finally {
    clearAccessToken();
    sessionStorage.removeItem("user");
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