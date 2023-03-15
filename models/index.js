import mongoose, { model } from "mongoose";
import { fileSchema } from "./file";
import { masallahSchema } from "./masallah";
import { masallahGroupSchema } from "./masallahGroup";
import { memberSchema } from "./member";
import { ramzanMemberSchema } from "./ramzanMembers";
import { settingsSchema } from "./settings";
import { userSchema } from "./user";

export const User = mongoose.models.User || model("User", userSchema, "user");
export const Member =
  mongoose.models.Member || model("Member", memberSchema, "member");
export const File = mongoose.models.File || model("File", fileSchema, "file");
export const Settings =
  mongoose.models.Settings || model("Settings", settingsSchema, "settings");
export const RamzanMemberV3 =
  mongoose.models.RamzanMemberV3 || model("RamzanMemberV3", ramzanMemberSchema);
export const MasallahV2 =
  mongoose.models.MasallahV2 || model("MasallahV2", masallahSchema);
export const MasallahGroupV2 =
  mongoose.models.MasallahGroupV2 ||
  model("MasallahGroupV2", masallahGroupSchema);
