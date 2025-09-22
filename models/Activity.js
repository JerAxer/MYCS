const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  code: String,
  name: String
});

module.exports = mongoose.model("Activity", ActivitySchema);
