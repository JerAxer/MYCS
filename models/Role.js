const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Le code du rôle est obligatoire"],
    trim: true,
    uppercase: true,
    maxlength: [50, "Le code ne peut pas dépasser 50 caractères"],
    unique: true,
    match: [/^[A-Z_]+$/, "Le code ne peut contenir que des lettres majuscules et des underscores"]
  },
  name: {
    type: String,
    required: [true, "Le nom du rôle est obligatoire"],
    trim: true,
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "La description ne peut pas dépasser 500 caractères"]
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
RoleSchema.index({ code: 1 });
RoleSchema.index({ name: 1 });

// Validation pour s'assurer que le code est unique
RoleSchema.path('code').validate(async function(code) {
  const role = await this.constructor.findOne({ code });
  return !role || role._id.equals(this._id);
}, 'Ce code rôle existe déjà');

// Middleware pour empêcher la suppression si des utilisateurs sont associés
RoleSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  const User = mongoose.model('User');
  const usersCount = await User.countDocuments({ role_id: this._id });
  
  if (usersCount > 0) {
    return next(new Error(`Impossible de supprimer ce rôle car ${usersCount} utilisateur(s) y sont associés`));
  }
  
  next();
});

// Méthode statique pour rechercher par code
RoleSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() });
};

// Méthode pour vérifier si le rôle est système (non supprimable)
RoleSchema.methods.isSystemRole = function() {
  const systemRoles = ['ADMIN', 'USER', 'GUEST'];
  return systemRoles.includes(this.code);
};

// Méthode d'instance pour formater l'affichage
RoleSchema.methods.toJSON = function() {
  const role = this.toObject();
  role.displayName = `${role.name} (${role.code})`;
  return role;
};

module.exports = mongoose.model("Role", RoleSchema);