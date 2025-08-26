import apiClient from "../apiClient";

export const getUsers = async () => {
  try {
    const response = await apiClient.get("users");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await apiClient.get(`users/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("users/", userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.patch(`users/${id}/`, userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`users/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("token/", credentials);

    const { access, refresh, user } = response.data;

    sessionStorage.setItem("accessToken", access);
    sessionStorage.setItem("user", JSON.stringify(user));

    document.cookie = `refreshToken=${refresh}; HttpOnly; Secure; SameSite=Strict;`;

    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const logoutUser = () => {
  try {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    document.cookie = "refreshToken=; HttpOnly; Secure; SameSite=Strict;";
    console.log("Logout realizado com sucesso!");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};

export const getInvitations = async (id) => {
  try {
    const response = await apiClient.get(`users/${id}/get_invitations/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar convites:", error);
    throw error;
  }

} 

export const verifyToken = async () => {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    return false;
  }

  try {
    await apiClient.post("token/verify/", { token });
    return true;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return false;
  }
}