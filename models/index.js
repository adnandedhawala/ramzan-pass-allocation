import mongoose, { model } from "mongoose";
import { userSchema } from "./user";

export const User = mongoose.models.User || model("User", userSchema, "user");
