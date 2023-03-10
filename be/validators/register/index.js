import * as yup from "yup";

export const verifyFileSchema = yup.object().shape({
  hof_id: yup.string().required(),
  file_number: yup.string().required()
});
