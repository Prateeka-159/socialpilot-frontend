const API_BASE_URL = "http://127.0.0.1:8000";

export default API_BASE_URL;

// With httpOnly cookies we no longer expose tokens to JS.
// authHeader now returns common headers; authentication is via cookie sent automatically.
export const authHeader = () => {
  return {
    "Content-Type": "application/json",
  };
};