const API_BASE_URL = "http://127.0.0.1:8000";

export default API_BASE_URL;

export const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};