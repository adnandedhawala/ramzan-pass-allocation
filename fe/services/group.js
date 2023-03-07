import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse
} from "fe/utlis";

export const getMasallahGroups = () => {
  return fetch(getApiUrl("masallahGroup"), {
    method: "GET",
    headers: {
      ...getAuthHeader(),
      ...getApplicationJsonHeader()
    }
  }).then(handleResponse);
};

export const editMasallahGroup = (groupId, groupDetails) => {
  let url = getApiUrl("masallahGroup") + "/" + groupId;
  return fetch(url, {
    method: "PATCH",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader()
    },
    body: JSON.stringify({ data: groupDetails })
  }).then(handleResponse);
};
