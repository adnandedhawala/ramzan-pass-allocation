/* eslint-disable security/detect-unsafe-regex */
import * as yup from "yup";

export const settingsSchema = yup.object().shape({
  is_registration_on: yup.bool(),
  is_zahra_registration_on: yup.bool(),
  _id: yup.string().required()
});
