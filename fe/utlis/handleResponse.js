import { message } from "antd";

const isValidJSON = string_ => {
  try {
    JSON.parse(string_);
    return true;
  } catch {
    return false;
  }
};

export const handleResponse = response => {
  const hasWindow = typeof window !== "undefined";
  return response.text().then(text => {
    const data = isValidJSON(text) ? JSON.parse(text) : text;
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("user");
        message.info("unauthorized user!!");
        if (hasWindow) window.location.reload();
      }
      if (response.status === 403) {
        localStorage.removeItem("user");
        message.info("Session timeout!!");
        if (hasWindow) window.location.reload();
      }
      throw data;
    }
    return data;
  });
};

export const handleVerifyUser = response => {
  return response.text().then(text => {
    const data = isValidJSON(text) ? JSON.parse(text) : text;
    if (!response.ok) {
      throw data;
    }
    return data;
  });
};
