import { getApiUrl, getApplicationJsonHeader, handleResponse } from "fe/utlis";

export const verify = userInfo => {
  return fetch(getApiUrl("verifyRegistration"), {
    method: "POST",
    headers: {
      ...getApplicationJsonHeader()
    },
    body: JSON.stringify({ data: userInfo })
  }).then(handleResponse);
};
