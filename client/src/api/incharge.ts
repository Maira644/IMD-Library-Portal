import API from "./apiClient";

export interface CreateInchargeRequest {
  name: string;
  username: string;
  email: string;
  department: string;
}

export async function createIncharge(data: CreateInchargeRequest) {
  const response = await API.post("/admin/create-incharge", data);
  return response.data;
}

export async function getAllIncharges() {
  const response = await API.get("/admin/incharges");
  return response.data;
}

export async function updateIncharge(
  inchargeId: string,
  data: CreateInchargeRequest
) {
  const response = await API.put(
    `/admin/incharges/${inchargeId}`,
    data
  );

  return response.data;
}

export async function toggleInchargeStatus(
  inchargeId: string
) {
  const response = await API.patch(
    `/admin/incharges/${inchargeId}/status`
  );

  return response.data;
}

export async function deleteIncharge(
  inchargeId: string
) {
  const response = await API.delete(
    `/admin/incharges/${inchargeId}`
  );

  return response.data;
}