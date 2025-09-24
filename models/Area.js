const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom de la zone géographique est obligatoire"],
    trim: true,
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    unique: true
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
AreaSchema.index({ name: 1 });

// Validation pour s'assurer que le nom est unique
AreaSchema.path('name').validate(async function(name) {
  const area = await this.constructor.findOne({ name });
  return !area || area._id.equals(this._id);
}, 'Cette zone géographique existe déjà');

// Middleware pour empêcher la suppression si des pays sont associés
AreaSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  const Country = mongoose.model('Country');
  const countriesCount = await Country.countDocuments({ area_id: this._id });
  
  if (countriesCount > 0) {
    return next(new Error(`Impossible de supprimer cette zone géographique car ${countriesCount} pays y sont associés`));
  }
  
  next();
});

module.exports = mongoose.model("Area", AreaSchema);