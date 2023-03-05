const { createGridDataFromExcel } = require("fe/services");

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
