import mongoose, { model } from "mongoose";
import { fileSchema } from "./file";
import { masallahSchema } from "./masallah";
import { masallahGroupSchema } from "./masallahGroup";
import { memberSchema } from "./member";
import { ramzanMemberSchema } from "./ramzanMembers";
import { userSchema } from "./user";

export const User = mongoose.models.User || model("User", userSchema, "user");
export const Member =
  mongoose.models.Member || model("Member", memberSchema, "member");
export const File = mongoose.models.File || model("File", fileSchema, "file");
export const RamzanMember =
  mongoose.models.RamzanMember || model("RamzanMember", ramzanMemberSchema);
export const Masallah =
  mongoose.models.Masallah || model("Masallah", masallahSchema);
export const MasallahGroup =
  mongoose.models.MasallahGroup || model("MasallahGroup", masallahGroupSchema);
