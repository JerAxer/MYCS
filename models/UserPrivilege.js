const mongoose = require("mongoose");

const UserPrivilegeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  privilege_id: { type: mongoose.Schema.Types.ObjectId, ref: "Privilege" }
});

module.exports = mongoose.model("UserPrivilege", UserPrivilegeSchema);
