const mongoose = require("mongoose");

const BusinessUnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom de l'unité métier est obligatoire"],
    trim: true,
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "La description ne peut pas dépasser 500 caractères"]
  },
  activity_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Activity",
    required: [true, "L'activité est obligatoire"]
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
BusinessUnitSchema.index({ name: 1 });
BusinessUnitSchema.index({ activity_id: 1 });
BusinessUnitSchema.index({ name: 1, activity_id: 1 });

// Validation pour éviter les doublons
BusinessUnitSchema.path('name').validate(async function(name) {
  const businessUnit = await this.constructor.findOne({ 
    name: name,
    activity_id: this.activity_id 
  });
  return !businessUnit || businessUnit._id.equals(this._id);
}, 'Une unité métier avec ce nom existe déjà pour cette activité');

// Populate automatique pour les requêtes find
BusinessUnitSchema.pre('find', function() {
  this.populate('activity_id', 'code name');
});

BusinessUnitSchema.pre('findOne', function() {
  this.populate('activity_id', 'code name');
});

// Middleware pour empêcher la suppression si des dépendances existent
BusinessUnitSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  // Ici vous pouvez ajouter des vérifications de dépendances
  // Par exemple, vérifier si des assessors ou sites utilisent cette BU
  // const Assessor = mongoose.model('Assessor');
  // const assessorsCount = await Assessor.countDocuments({ business_unit_id: this._id });
  
  // if (assessorsCount > 0) {
  //   return next(new Error(`Impossible de supprimer cette unité métier car ${assessorsCount} assessor(s) y sont associés`));
  // }
  
  next();
});

// Méthode statique pour rechercher par activité
BusinessUnitSchema.statics.findByActivity = function(activityId) {
  return this.find({ activity_id: activityId }).populate('activity_id');
};

// Méthode d'instance pour formater l'affichage
BusinessUnitSchema.methods.toJSON = function() {
  const businessUnit = this.toObject();
  if (businessUnit.activity_id && typeof businessUnit.activity_id === 'object') {
    businessUnit.displayName = `${businessUnit.name} (${businessUnit.activity_id.code})`;
  } else {
    businessUnit.displayName = businessUnit.name;
  }
  return businessUnit;
};

module.exports = mongoose.model("BusinessUnit", BusinessUnitSchema);