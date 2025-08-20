import apiClient from "../apiClient";

export const getTeams = async (userOnly = false, codeAccess = null) => {
  try {
    let queryParam = userOnly ? "?userOnly=true" : "";
    if (codeAccess) {
      queryParam += queryParam
        ? `&codeAccess=${codeAccess}`
        : `?codeAccess=${codeAccess}`;
    }
    const response = await apiClient.get(`/teams${queryParam}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar equipes:", error);
    throw error;
  }
};

export const getTeam = async (id) => {
  try {
    const response = await apiClient.get(`teams/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar equipe:", error);
    throw error;
  }
};

export const createTeam = async (teamData) => {
  try {
    const response = await apiClient.post("teams/", teamData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar equipe:", error);
    throw error;
  }
};

export const updateTeam = async (id, teamData) => {
  try {
    const response = await apiClient.patch(`teams/${id}/`, teamData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar equipe:", error);
    throw error;
  }
};

export const deleteTeam = async (id) => {
  try {
    const response = await apiClient.delete(`teams/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar equipe:", error);
    throw error;
  }
};

export const addMember = async (id, memberId) => {
  try {
    const response = await apiClient.post(
      `teams/${id}/add_member/`,
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
      `teams/${id}/remove_member/`,
      memberId
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao remover membro:", error);
    throw error;
  }
};

export const getAvailableMembers = async (id, date) => {
  try {
    const response = await apiClient.post(
      `teams/${id}/get_available_members/`,
      date
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar membros disponíveis:", error);
    throw error;
  }
}