import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse
} from "fe/utlis";

export const verifyFileData = data => {
  return fetch(getApiUrl("registerVerifyFile"), {
    method: "POST",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader()
    },
    body: JSON.stringify({ data })
  }).then(handleResponse);
};
