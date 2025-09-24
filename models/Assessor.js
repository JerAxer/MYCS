const mongoose = require("mongoose");

const AssessorSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  type: String,
  is_suzuki: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Assessor", AssessorSchema);
