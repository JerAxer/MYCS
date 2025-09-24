const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
  area_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Area",
    required: [true, "La zone géographique est obligatoire"]
  },
  code: {
    type: String,
    required: [true, "Le code pays est obligatoire"],
    uppercase: true,
    trim: true,
    maxlength: [2, "Le code pays ne peut pas dépasser 2 caractères"],
    match: [/^[A-Z]{2}$/, "Le code pays doit contenir exactement 2 lettres majuscules"]
  },
  name: {
    type: String,
    required: [true, "Le nom du pays est obligatoire"],
    trim: true,
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"]
  },
  name_en: {
    type: String,
    required: [true, "Le nom anglais du pays est obligatoire"],
    trim: true,
    maxlength: [100, "Le nom anglais ne peut pas dépasser 100 caractères"]
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
CountrySchema.index({ code: 1 }, { unique: true });
CountrySchema.index({ name: 1 });
CountrySchema.index({ name_en: 1 });
CountrySchema.index({ area_id: 1 });

// Validation pour s'assurer que le code est unique
CountrySchema.path('code').validate(async function(code) {
  const country = await this.constructor.findOne({ code });
  return !country || country._id.equals(this._id);
}, 'Ce code pays existe déjà');

module.exports = mongoose.model("Country", CountrySchema);