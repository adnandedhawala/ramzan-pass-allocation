import * as yup from "yup";

export const editGroupSchema = yup.object().shape({
  name: yup.string(),
  color: yup.string(),
  is_blocked: yup.bool()
});
