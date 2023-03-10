import get from "lodash/get";

const prefix =
  (process.env.NEXT_PUBLIC_ROOT_API_URL || "http://localhost:3000") +
  "/api/v1/";

const API = {
  login: "user/auth/login",
  verify: "user/auth/verify",
  ramzanMembers: "member/ramzanMembers",
  uploadMasallah: "masallah/uploadGrid",
  masallahGroup: "masallah/group",
  masallah: "masallah",
  allocate: "allocate",
  settings: "settings",
  user: "user",
  registerVerifyFile: "register/verifyFile"
};

export const getApiUrl = urlName => prefix + get(API, urlName);
