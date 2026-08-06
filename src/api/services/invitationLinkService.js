import apiClient from "../apiClient";

export const resolveInvitationLink = async (token) => {
  const response = await apiClient.get("/invitation_links/resolve/", {
    params: { token },
  });
  return response.data;
};

export const acceptInvitationLink = async (token) => {
  const response = await apiClient.post("/invitation_links/accept/", { token });
  return response.data;
};

export const getOrCreateOrganizationInvitationLink = async (organizationId) => {
  const response = await apiClient.post("/invitation_links/", {
    target_type: "organization",
    target_id: organizationId,
  });
  return response.data;
};

export const revokeInvitationLink = async (linkId) => {
  await apiClient.post(`/invitation_links/${linkId}/revoke/`);
};

export const regenerateInvitationLink = async (linkId) => {
  const response = await apiClient.post(
    `/invitation_links/${linkId}/regenerate/`,
    {},
  );
  return response.data;
};
