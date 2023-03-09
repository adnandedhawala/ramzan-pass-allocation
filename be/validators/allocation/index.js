import * as yup from "yup";

export const addAllocationSchema = yup.object().shape({
  location: yup.string(),
  daska: yup.string(),
  data: yup.array()
});
