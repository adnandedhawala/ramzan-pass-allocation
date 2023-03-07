import { editMasallahGroup, getMasallahGroups } from "fe/services";

export const getMasallahGroupsHelper = ({ successFn, errorFn, endFn }) => {
  getMasallahGroups()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const editMasallahGroupHelper = ({
  values,
  groupId,
  successFn,
  errorFn,
  endFn
}) => {
  editMasallahGroup(groupId, values)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
