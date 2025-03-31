import apiClient from "../apiClient";

export const getRequests = async (codeAccess = null) => {
  try {
    let queryParam = codeAccess ? `?codeAccess=${codeAccess}` : ""

    const response = await apiClient.get(`solicitacoes${queryParam}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);
    throw error;
  }
};

export const createRequest = async (requestData) => {

  try {
    const response = await apiClient.post("solicitacoes/", requestData);
    return response.data;

  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    throw error;
  }

}

export const deleteRequest = async (id) => {
  try {
    const response = await apiClient.delete(`solicitacoes/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar solicitaçao:", error);
    throw error;
  }

}