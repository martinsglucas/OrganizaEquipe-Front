import apiClient from "../apiClient";

export const getOrganizations = async (userOnly = false) => {
  try {
    let queryParam = userOnly ? "?userOnly=true" : "";
    const response = await apiClient.get(`/organizations${queryParam}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar organizações:", error);
    throw error;
  }
}

export const getOrganization = async (id) => {
  try {
    const response = await apiClient.get(`/organizations/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar organização:", error);
    throw error;
  }
}

export const createOrganization = async (organizationData) => {
  try {
    const response = await apiClient.post("/organizations/", organizationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar organização:", error);
    throw error;
  }
}

export const updateOrganization = async (id, organizationData) => {
  try {
    const response = await apiClient.patch(`/organizations/${id}/`, organizationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar organização:", error);
    throw error;
  }
}

export const deleteOrganization = async (id) => {
  try {
    const response = await apiClient.delete(`/organizations/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar organização:", error);
    throw error;
  }
}