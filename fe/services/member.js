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
