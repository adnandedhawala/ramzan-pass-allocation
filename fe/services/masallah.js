import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse
} from "fe/utlis";

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

export const allocateMemberToMasallah = data => {
  return fetch(getApiUrl("allocate"), {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      ...getApplicationJsonHeader()
    },
    body: JSON.stringify({ data })
  }).then(handleResponse);
};
