import { MEMBER_TYPE } from "appConstants";
import { Schema } from "mongoose";

export const memberSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, "name is missing"]
    },
    hof_fm_type: {
      type: String,
      enum: Object.values(MEMBER_TYPE)
    },
    gender: {
      type: String,
      required: [true, "gender is missing"]
    },
    misaq: {
      type: String
    },
    hof_id: {
      type: Number,
      required: [true, "hof_id is missing"]
    },
    age: {
      type: Number
    },
    _id: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
