import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse
} from "fe/utlis";

export const getSettings = () => {
  return fetch(getApiUrl("settings"), {
    method: "GET",
    headers: {
      ...getAuthHeader(),
      ...getApplicationJsonHeader()
    }
  }).then(handleResponse);
};

export const editSettings = settingData => {
  return fetch(getApiUrl("settings"), {
    method: "PATCH",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader()
    },
    body: JSON.stringify({ data: settingData })
  }).then(handleResponse);
};
