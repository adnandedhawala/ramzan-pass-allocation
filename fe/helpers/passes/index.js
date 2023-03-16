import { verifyFileAndGetMemberData } from "fe/services";

export const verifyFileAndGetMemberDataHelper = ({
  successFn,
  errorFn,
  endFn,
  data
}) => {
  verifyFileAndGetMemberData(data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
