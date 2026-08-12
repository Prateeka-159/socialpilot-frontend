import API_BASE_URL, { authHeader } from "./api";

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
    headers: authHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch profile");
  }

  return data;
};

export const updateProfile = async (name) => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    credentials: "include",
    headers: authHeader(),
    body: JSON.stringify({
      name,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update profile");
  }

  return data;
};