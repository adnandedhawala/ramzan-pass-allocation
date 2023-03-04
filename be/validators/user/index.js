/* eslint-disable security/detect-unsafe-regex */
import * as yup from "yup";

const invalidEmailMessage = "invalid email";
const requiredEmailMessage = "email is required";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required(requiredEmailMessage)
    .lowercase()
    .trim()
    .email(invalidEmailMessage),
  password: yup
    .string()
    .required("password is required")
    .min(8, "password should be atleast 8 characters")
});
