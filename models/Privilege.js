const mongoose = require("mongoose");

const PrivilegeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: String
});

module.exports = mongoose.model("Privilege", PrivilegeSchema);
