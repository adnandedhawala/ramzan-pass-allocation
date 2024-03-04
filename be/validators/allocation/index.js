import * as yup from "yup";

export const addAllocationSchema = yup.object().shape({
  location: yup.string(),
  daska: yup.string(),
  data: yup.array()
});

export const editAllocationSchema = yup.object().shape({
  location: yup.string(),
  data: yup.object()
});

export const updateAllocationSchema = yup.array().of(
  yup.object().shape({
    _id: yup.string().required(),
    show_pass: yup.bool().required()
  })
);
