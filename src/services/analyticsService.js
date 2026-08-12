export const getAnalytics = async () => {
    return {
        followers:12400,
        engagement:86
    };
}

/*
import API_BASE_URL, { authHeader } from "./api";

export const getAnalytics = async () => {
    const response = await fetch(
        `${API_BASE_URL}/admin/dashboard`,
        {
            headers: authHeader(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail);
    }

    return data;
};
*/