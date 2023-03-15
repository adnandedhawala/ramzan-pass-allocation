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

export const resetMasallahAllocations = () => {
  return fetch(getApiUrl("allocate"), {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      ...getApplicationJsonHeader()
    }
  }).then(handleResponse);
};

export const allocatePasses = (location, daska) => {
  let url = getApiUrl("allocateMasallah") + "?location=" + location;
  const finalUrl = daska ? url + "&daska=" + daska : url;
  return fetch(finalUrl, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      ...getApplicationJsonHeader()
    }
  }).then(handleResponse);
};
