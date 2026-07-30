const API_URL = "http://127.0.0.1:8000";


export interface CreateInchargeRequest {
    name: string;
    username: string;
    email: string;
    department: string;
}


export async function createIncharge(data: CreateInchargeRequest) {

    const response = await fetch(
        `${API_URL}/admin/create-incharge`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail);
    }

    return result;
}

export async function getAllIncharges() {

    const response = await fetch(
        `${API_URL}/admin/incharges`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch incharges");
    }

    return await response.json();
}

export async function updateIncharge(
    inchargeId: string,
    data: CreateInchargeRequest
) {

    const response = await fetch(
        `${API_URL}/admin/incharges/${inchargeId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail);
    }

    return result;
}

export async function toggleInchargeStatus(
    inchargeId: string
) {

    const response = await fetch(
        `${API_URL}/admin/incharges/${inchargeId}/status`,
        {
            method: "PATCH",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail);
    }

    return result;
}

export async function deleteIncharge(
    inchargeId: string
) {

    const response = await fetch(
        `${API_URL}/admin/incharges/${inchargeId}`,
        {
            method: "DELETE",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail);
    }

    return result;
}