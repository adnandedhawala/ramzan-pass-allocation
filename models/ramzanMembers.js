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
        type: Boolean,
        default: false
      },
      d2: {
        type: Boolean,
        default: false
      },
      d3: {
        type: Boolean,
        default: false
      }
    },
    allocation: {
      d1: {
        type: String,
        default: ""
      },
      d2: {
        type: String,
        default: ""
      },
      d3: {
        type: String,
        default: ""
      }
    },
    is_rahat: { type: Boolean, default: false },
    has_selected_pass: { type: Boolean, default: false },
    is_registered: { type: Boolean, default: false },
    show_pass: { type: Boolean, default: false }
  },
  { timestamps: true }
);
