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

export const acceptTeamInvitation = async (id) => {
  try {
    const response = await apiClient.post(`team_invitations/${id}/accept/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao aceitar convite:", error);
    throw error;
  }
};

export const rejectTeamInvitation = async (id) => {
  try {
    const response = await apiClient.post(`team_invitations/${id}/reject/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao recusar convite:", error);
    throw error;
  }
};
