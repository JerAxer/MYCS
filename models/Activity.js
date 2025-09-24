const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Le code de l'activité est obligatoire"],
    trim: true,
    uppercase: true,
    maxlength: [50, "Le code ne peut pas dépasser 50 caractères"],
    unique: true
  },
  name: {
    type: String,
    required: [true, "Le nom de l'activité est obligatoire"],
    trim: true,
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"]
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
ActivitySchema.index({ code: 1 });
ActivitySchema.index({ name: 1 });

// Validation pour s'assurer que le code est unique
ActivitySchema.path('code').validate(async function(code) {
  const activity = await this.constructor.findOne({ code });
  return !activity || activity._id.equals(this._id);
}, 'Ce code activité existe déjà');

// Méthode statique pour rechercher par code
ActivitySchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() });
};

// Méthode d'instance pour formater l'affichage
ActivitySchema.methods.toJSON = function() {
  const activity = this.toObject();
  activity.displayName = `${activity.code} - ${activity.name}`;
  return activity;
};

module.exports = mongoose.model("Activity", ActivitySchema);