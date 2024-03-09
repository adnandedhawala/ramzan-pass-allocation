import { Schema } from "mongoose";

export const ramzanMemberSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    member_details: {
      type: String,
      ref: "Member"
    },
    masjid: {
      type: String,
      default: ""
    },
    hof_id: {
      type: String,
      ref: "File",
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
    d1: {
      location: {
        type: String,
        default: ""
      },
      masallah: {
        type: String,
        ref: "Masallah",
        default: ""
      }
    },
    d2: {
      location: {
        type: String,
        default: ""
      },
      masallah: {
        type: String,
        ref: "Masallah",
        default: ""
      }
    },
    d3: {
      location: {
        type: String,
        default: ""
      },
      masallah: {
        type: String,
        ref: "Masallah",
        default: ""
      }
    },
    is_rahat: { type: Boolean, default: false },
    has_selected_pass: { type: Boolean, default: false },
    is_registered: { type: Boolean, default: false },
    show_pass: { type: Boolean, default: false },
    has_seen_pass: { type: Boolean, default: false },
    has_seen_pass_date: { type: Date }
  },
  { timestamps: true }
);
