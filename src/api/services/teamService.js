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
