// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  assessor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Assessor" },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // <- select:false
  first_name: String,
  last_name: String,
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Hash avant save (inchangé)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// comparePassword (inchangé)
UserSchema.methods.comparePassword = function (password) {
  // this.password peut être undefined si on n'a pas fait .select('+password')
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
