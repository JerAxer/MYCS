const mongoose = require("mongoose");

const SiteSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Le code du site est obligatoire"],
    trim: true,
    uppercase: true,
    maxlength: [50, "Le code ne peut pas dépasser 50 caractères"],
    unique: true
  },
  name: {
    type: String,
    required: [true, "Le nom du site est obligatoire"],
    trim: true,
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"]
  },
  internal_code: {
    type: String,
    trim: true,
    maxlength: [50, "Le code interne ne peut pas dépasser 50 caractères"]
  },
  country_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Country",
    required: [true, "Le pays est obligatoire"]
  },
  company_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Company",
    required: [true, "L'entreprise est obligatoire"]
  },
  city: {
    type: String,
    trim: true,
    maxlength: [100, "La ville ne peut pas dépasser 100 caractères"]
  },
  address: {
    type: String,
    trim: true,
    maxlength: [255, "L'adresse ne peut pas dépasser 255 caractères"]
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
SiteSchema.index({ code: 1 });
SiteSchema.index({ name: 1 });
SiteSchema.index({ internal_code: 1 });
SiteSchema.index({ country_id: 1 });
SiteSchema.index({ company_id: 1 });
SiteSchema.index({ city: 1 });

// Validation pour s'assurer que le code est unique
SiteSchema.path('code').validate(async function(code) {
  const site = await this.constructor.findOne({ code });
  return !site || site._id.equals(this._id);
}, 'Ce code site existe déjà');

// Populate automatique pour les requêtes find
SiteSchema.pre('find', function() {
  this.populate('country_id company_id');
});

SiteSchema.pre('findOne', function() {
  this.populate('country_id company_id');
});

module.exports = mongoose.model("Site", SiteSchema);