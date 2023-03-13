import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse
} from "fe/utlis";

export const createRamzanMembers = () => {
  return fetch(getApiUrl("ramzanMembers"), {
    method: "POST",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader()
    }
  }).then(handleResponse);
};

export const getRamzanMembers = showRegistered => {
  let url = getApiUrl("ramzanMembers");
  let finalUrl = showRegistered ? url + "?showRegistered=true" : url;
  return fetch(finalUrl, {
    method: "GET",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader()
    }
  }).then(handleResponse);
};
