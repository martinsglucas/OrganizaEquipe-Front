import apiClient from "../apiClient";

export const getSchedules = async (userOnly = false, filter = "all") => {
  try {
    let queryParam = userOnly ? "?userOnly=true" : "";
    if (filter) {
      queryParam += queryParam
        ? `&filter=${filter}`
        : `?filter=${filter}`;
    }
    const response = await apiClient.get(`/schedules${queryParam}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar escalas:", error);
    throw error;
  }
};

export const getSchedule = async (id) => {
  try {
    const response = await apiClient.get(`schedules/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar escala:", error);
    throw error;
  }
};

export const createSchedule = async (scheduleData) => {
  try {
    const response = await apiClient.post("schedules/", scheduleData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar escala:", error);
    throw error;
  }
};

export const updateSchedule = async (id, scheduleData) => {
  try {
    const response = await apiClient.patch(`schedules/${id}/`, scheduleData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar escala:", error);
    throw error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    const response = await apiClient.delete(`schedules/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar escala:", error);
    throw error;
  }
};

export const confirmScheduleParticipation = async (participationId, confirmData) => {
  try {
    const response = await apiClient.patch(
      `participations/${participationId}/`,
      confirmData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao confirmar participação na escala:", error);
    throw error;
  }
}