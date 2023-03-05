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
    group: { type: String, ref: "Masallah" },
    location: {
      type: String,
      enum: Object.values(SEAT_LOCATIONS)
    },
    d1: {
      type: String
    },
    d2: {
      type: String
    },
    d3: {
      type: String
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
