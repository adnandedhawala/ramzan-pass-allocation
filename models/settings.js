import { Schema } from "mongoose";

export const settingsSchema = new Schema(
  {
    is_registration_on: {
      type: Boolean,
      default: true
    },
    _id: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
