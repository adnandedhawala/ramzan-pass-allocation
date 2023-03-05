import { createRamzanMembers } from "fe/services";

export const createRamzanMembersHelper = ({ successFn, errorFn, endFn }) => {
  createRamzanMembers()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
