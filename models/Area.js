const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model("Area", AreaSchema);
