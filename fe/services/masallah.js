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
