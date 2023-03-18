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

export const getAllocatedRamzanMembers = () => {
  return fetch(getApiUrl("allocate"), {
    method: "GET",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader()
    }
  }).then(handleResponse);
};

export const editAllocatedRamzanMembers = data => {
  return fetch(getApiUrl("allocate"), {
    method: "PATCH",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader()
    },
    body: JSON.stringify({ data })
  }).then(handleResponse);
};

export const resetRamzanRegistration = () => {
  return fetch(getApiUrl("ramzanMembers"), {
    method: "PUT",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader()
    }
  }).then(handleResponse);
};
