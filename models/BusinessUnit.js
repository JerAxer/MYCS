const mongoose = require("mongoose");

const BusinessUnitSchema = new mongoose.Schema({
  name: String,
  description: String,
  activity_id: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" }
});

module.exports = mongoose.model("BusinessUnit", BusinessUnitSchema);
