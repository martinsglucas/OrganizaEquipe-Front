import apiClient from "../apiClient";

export const getUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await apiClient.get(`usuarios/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("usuarios/", userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    // const response = await apiClient.put(`usuarios/${id}/`, userData);
    const response = await apiClient.patch(`usuarios/${id}/`, userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`usuarios/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("token/", credentials);

    const { access, refresh, user_id } = response.data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("userId", user_id);

    document.cookie = `refreshToken=${refresh}; HttpOnly; Secure; SameSite=Strict;`;

    console.log(user_id);
    console.log(access);

    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    console.log("Logout realizado com sucesso!");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};
