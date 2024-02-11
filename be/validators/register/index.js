import * as yup from "yup";

export const verifyFileSchema = yup.object().shape({
  hof_id: yup.string().required(),
  file_number: yup.string().required()
});

export const registerSchema = yup.array().of(
  yup.object().shape({
    _id: yup.string().required(),
    masjid: yup.string(),
    registration: yup
      .object()
      .shape({
        d1: yup.bool(),
        d2: yup.bool(),
        d3: yup.bool()
      })
      .required(),
    is_rahat: yup.bool()
  })
);
