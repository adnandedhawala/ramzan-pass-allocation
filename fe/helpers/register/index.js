import { registerMembers, verifyFileData } from "fe/services";

export const verifyFileDataHelper = ({ successFn, errorFn, endFn, data }) => {
  verifyFileData(data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const registerMembersHelper = ({ successFn, errorFn, endFn, data }) => {
  registerMembers(data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
