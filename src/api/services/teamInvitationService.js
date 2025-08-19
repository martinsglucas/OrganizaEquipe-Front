import apiClient from "../apiClient";

export const getTeamInvitations = async (addressee = null) => {
  try {
    let queryParam = addressee ? `?addressee=${addressee}` : "";

    const response = await apiClient.get(`team_invitations${queryParam}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);
    throw error;
  }
};

export const createTeamInvitation = async (invitationData) => {
  try {
    const response = await apiClient.post("team_invitations/", invitationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar o convite:", error);
    throw error;
  }
}

export const deleteTeamInvitation = async (id) => {
  try {
    const response = await apiClient.delete(`team_invitations/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar solicitaçao:", error);
    throw error;
  }
};