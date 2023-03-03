export const saveAuthToken = token => {
  localStorage.setItem("user", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("user");
};

export const clearAuthToken = () => {
  localStorage.removeItem("user");
};

export const getAuthHeader = () => {
  const accessToken = localStorage.getItem("user");
  return { authorization: accessToken };
};

export const getApplicationJsonHeader = () => ({
  "Content-Type": "application/json"
});
