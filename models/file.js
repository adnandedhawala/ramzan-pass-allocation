import { Schema } from "mongoose";

export const fileSchema = new Schema(
  {
    tanzeem_file_no: {
      type: String,
      required: [true, "tanzeem_file_no is missing"]
    },
    member_ids: [
      {
        type: String,
        ref: "Member"
      }
    ],
    _id: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
