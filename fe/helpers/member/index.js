import {
  createRamzanMembers,
  editAllocatedRamzanMembers,
  getAllocatedRamzanMembers,
  getRamzanMembers,
  resetRamzanRegistration
} from "fe/services";

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

export const getAllocatedRamzanMembersHelper = ({
  successFn,
  errorFn,
  endFn
}) => {
  getAllocatedRamzanMembers()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const editAllocatedRamzanMembersHelper = ({
  successFn,
  errorFn,
  endFn,
  data
}) => {
  editAllocatedRamzanMembers(data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const resetRamzanRegistrationHelper = ({
  successFn,
  errorFn,
  endFn
}) => {
  resetRamzanRegistration()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
