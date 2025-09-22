const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Role", RoleSchema);
