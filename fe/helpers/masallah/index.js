const {
  createGridDataFromExcel,
  getMasallahByLocation
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
