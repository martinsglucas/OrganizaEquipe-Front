import apiClient from "../apiClient";

export const createFunction = async (functionData) => {
  try {
    const response = await apiClient.post("funcoes/", functionData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar função:", error);
    throw error;
  }
}

export const updateFunction = async (id, functionData) => {
  try {
    const response = await apiClient.patch(`funcoes/${id}/`, functionData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar função:", error);
    throw error;
  }
}

export const deleteFunction = async (id) => {
  try {
    const response = await apiClient.delete(`funcoes/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar função:", error);
    throw error;
  }
}