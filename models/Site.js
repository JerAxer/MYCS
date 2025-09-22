const mongoose = require("mongoose");

const SiteSchema = new mongoose.Schema({
  code: String,
  name: String,
  internal_code: String,
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  city: String,
  address: String
});

module.exports = mongoose.model("Site", SiteSchema);
