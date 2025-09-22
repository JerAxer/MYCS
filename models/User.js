const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  assessor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Assessor" },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  username: { type: String, required: true, unique: true },
  password: String,
  first_name: String,
  last_name: String,
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
