const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
  area_id: { type: mongoose.Schema.Types.ObjectId, ref: "Area" },
  code: String,
  name: String,
  name_en: String
});

module.exports = mongoose.model("Country", CountrySchema);
