import apiClient from "../apiClient";

export const getTeams = async (userOnly = false) => {
  try {
    const queryParam = userOnly ? "?userOnly=true" : "";
    const response = await apiClient.get(`/equipes${queryParam}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar equipes:", error);
    throw error;
  }
};

export const getTeam = async (id) => {
  try {
    const response = await apiClient.get(`equipes/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar equipe:", error);
    throw error;
  }
};

export const createTeam = async (teamData) => {
  try {
    const response = await apiClient.post("equipes/", teamData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar equipe:", error);
    throw error;
  }
};

export const updateTeam = async (id, teamData) => {
  try {
    const response = await apiClient.patch(`equipes/${id}/`, teamData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar equipe:", error);
    throw error;
  }
};

export const deleteTeam = async (id) => {
  try {
    const response = await apiClient.delete(`equipes/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar equipe:", error);
    throw error;
  }
};

export const addMember = async (id, memberId) => {
  try {
    const response = await apiClient.post(
      `equipes/${id}/add_member/`,
      memberId
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar membro:", error);
    throw error;
  }
};

export const removeMember = async (id, memberId) => {
  try {
    const response = await apiClient.post(
      `equipes/${id}/remove_member/`,
      memberId
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao remover membro:", error);
    throw error;
  }
};
