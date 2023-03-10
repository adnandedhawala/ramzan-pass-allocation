const {
  createGridDataFromExcel,
  getMasallahByLocation,
  allocateMemberToMasallah
} = require("fe/services");

export const createGridDataFromExcelHelper = ({
  successFn,
  errorFn,
  endFn,
  formData
}) => {
  createGridDataFromExcel(formData)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const getMasallahByLocationHelper = ({
  successFn,
  errorFn,
  endFn,
  location
}) => {
  getMasallahByLocation(location)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const getMasallahByLocationWithUserDataHelper = ({
  successFn,
  errorFn,
  endFn,
  location
}) => {
  getMasallahByLocation(location, true)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const allocateMemberToMasallahHelper = ({
  successFn,
  errorFn,
  endFn,
  data
}) => {
  allocateMemberToMasallah(data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
