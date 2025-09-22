const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: String,
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: "Country" }
});

module.exports = mongoose.model("Company", CompanySchema);
