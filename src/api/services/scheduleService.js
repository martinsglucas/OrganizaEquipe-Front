import apiClient from "../apiClient";

const extractPageNumber = (url) => {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url, window.location.origin);
    const page = parsedUrl.searchParams.get("page");
    return page ? Number(page) : null;
  } catch (error) {
    return null;
  }
};

export const getSchedules = async (
  scope = "all",
  filter = "next",
  page = 1,
  pageSize = 10
) => {
  try {
    const response = await apiClient.get("/schedules", {
      params: { scope, filter, page, page_size: pageSize },
    });

    return {
      results: response.data.results || [],
      count: response.data.count || 0,
      nextPage: extractPageNumber(response.data.next),
      previousPage: extractPageNumber(response.data.previous),
    };
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

export const confirmScheduleParticipation = async (
  participationId,
  confirmData
) => {
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
};
