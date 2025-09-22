const mongoose = require("mongoose");

const LanguageSchema = new mongoose.Schema({
  code: String,
  name: String
});

module.exports = mongoose.model("Language", LanguageSchema);
