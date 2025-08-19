import apiClient from "../apiClient";

export const getUnavailabilities = async (userOnly = false, date) => {
  try {
    let queryParam = userOnly ? "?userOnly=true" : "";
    if (date) {
      queryParam += queryParam ? `&date=${date}` : `?date=${date}`;
    }
    const response = await apiClient.get(`unavailability${queryParam}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar indisponibilidades:", error);
    throw error;
  }
};

export const createUnavailability = async (data) => {
  try {
    const response = await apiClient.post("unavailability/", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar indisponibilidade:", error);
    throw error;
  }
};

export const updateUnavailability = async (id, data) => {
  try {
    const response = await apiClient.patch(`unavailability/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar indisponibilidade:", error);
    throw error;
  }
};

export const deleteUnavailability = async (id) => {
  try {
    const response = await apiClient.delete(`unavailability/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar indisponibilidade:", error);
    throw error;
  }
};
