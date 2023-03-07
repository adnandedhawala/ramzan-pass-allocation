import { SEAT_LOCATIONS } from "appConstants";
import { Schema } from "mongoose";

export const masallahSchema = new Schema(
  {
    seat_number: {
      type: String,
      required: true
    },
    position: {
      x: { type: Number },
      y: { type: Number }
    },
    group: { type: String, ref: "MasallahGroup" },
    location: {
      type: String,
      enum: Object.values(SEAT_LOCATIONS)
    },
    d1: {
      type: String,
      ref: "RamzanMemberV3",
      default: ""
    },
    d2: {
      type: String,
      ref: "RamzanMemberV3",
      default: ""
    },
    d3: {
      type: String,
      ref: "RamzanMemberV3",
      default: ""
    },
    view_pass: {
      d1: {
        type: Boolean
      },
      d2: {
        type: Boolean
      },
      d3: {
        type: Boolean
      }
    }
  },
  { timestamps: true }
);
