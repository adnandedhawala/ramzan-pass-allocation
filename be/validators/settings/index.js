/* eslint-disable security/detect-unsafe-regex */
import * as yup from "yup";

export const settingsSchema = yup.object().shape({
  is_zahra_registration_on_male: yup.bool(),
  is_zahra_registration_on_female: yup.bool(),
  _id: yup.string().required()
});
