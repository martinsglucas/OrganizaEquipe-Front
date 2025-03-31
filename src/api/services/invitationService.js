import apiClient from "../apiClient";

export const getInvitations = async (addressee = null) => {
  try {
    let queryParam = addressee ? `?addressee=${addressee}` : "";

    const response = await apiClient.get(`convites${queryParam}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);
    throw error;
  }
};

export const createInvitation = async (invitationData) => {
  try {
    const response = await apiClient.post("convites/", invitationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar o convite:", error);
    throw error;
  }
}