import { createRamzanMembers, getRamzanMembers } from "fe/services";

export const createRamzanMembersHelper = ({ successFn, errorFn, endFn }) => {
  createRamzanMembers()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const getRamzanMembersHelper = ({
  successFn,
  errorFn,
  endFn,
  showRegistered = false
}) => {
  getRamzanMembers(showRegistered)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
