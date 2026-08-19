const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const TOKEN_KEY = "access_token";

export default API_BASE_URL;

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const authHeader = (includeJson = true) => {
  const headers = {};

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const normalizeRole = (role) => {
  if (role === "Admin") {
    return "Administrator";
  }

  return role;
};

export const toApiRole = (displayRole) => {
  const roleMap = {
    Administrator: "Admin",
    "Business User": "Business User",
    "Marketing Team": "Marketing Team",
    "Content Creator": "Content Creator",
  };

  return roleMap[displayRole] || displayRole;
};

export const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(", ")
          : data.message || "Request failed";

    throw new Error(message);
  }

  return data;
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...authHeader(options.body instanceof FormData ? false : true),
      ...options.headers,
    },
  });

  return handleResponse(response);
};
