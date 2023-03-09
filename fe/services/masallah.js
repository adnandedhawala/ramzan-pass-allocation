import { getApiUrl, getAuthHeader, handleResponse } from "fe/utlis";

export const createGridDataFromExcel = formData => {
  return fetch(getApiUrl("uploadMasallah"), {
    method: "POST",
    headers: {
      ...getAuthHeader()
    },
    body: formData
  }).then(handleResponse);
};

export const getMasallahByLocation = location => {
  return fetch(getApiUrl("masallah") + "/?location=" + location, {
    method: "GET",
    headers: {
      ...getAuthHeader()
    }
  }).then(handleResponse);
};
