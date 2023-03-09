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

export const getMasallahByLocation = (location, showUserData) => {
  const baseUrl = getApiUrl("masallah") + "/?location=" + location;
  const url = showUserData ? baseUrl + "&showMemberData=yes" : baseUrl;
  return fetch(url, {
    method: "GET",
    headers: {
      ...getAuthHeader()
    }
  }).then(handleResponse);
};
