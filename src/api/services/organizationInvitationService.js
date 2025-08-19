import apiClient from "../apiClient";

export const getOrganizationInvitations = async (addressee = null) => {
  try {
    let queryParam = addressee ? `?addressee=${addressee}` : "";

    const response = await apiClient.get(`organization_invitations${queryParam}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);
    throw error;
  }
};

export const createOrganizationInvitation = async (invitationData) => {
  try {
    const response = await apiClient.post("organization_invitations/", invitationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar o convite:", error);
    throw error;
  }
};

export const deleteOrganizationInvitation = async (id) => {
  try {
    const response = await apiClient.delete(`organization_invitations/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar solicitaçao:", error);
    throw error;
  }
}