import { Schema } from "mongoose";

export const ramzanMemberSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    hof_id: {
      type: String,
      required: true
    },
    registration: {
      d1: {
        type: Boolean
      },
      d2: {
        type: Boolean
      },
      d3: {
        type: Boolean
      }
    },
    allocation: {
      d1: {
        type: String
      },
      d2: {
        type: String
      },
      d3: {
        type: String
      }
    },
    has_selected_pass: { type: Boolean },
    is_registered: { type: Boolean },
    show_pass: { type: Boolean }
  },
  { timestamps: true }
);
