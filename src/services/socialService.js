import API_BASE_URL, { authHeader } from "./api";

export const getAccounts = async () => {
  const response = await fetch(
    `${API_BASE_URL}/social-accounts`,
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

export const connectAccount = async (platform, username) => {
  const response = await fetch(
    `${API_BASE_URL}/social-accounts/connect`,
    {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({
        platform,
        username,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
};

export const deleteAccount = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/social-accounts/${id}`,
    {
      method: "DELETE",
      headers: authHeader(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
};