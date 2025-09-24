const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs de l'application CFAO
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     description: |
 *       Crée un nouvel utilisateur. 
 *       - Si c'est le premier utilisateur de la base de données, aucun token n'est requis
 *       - Si des utilisateurs existent déjà, un token JWT valide est requis
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john.doe"
 *                 description: Nom d'utilisateur unique
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "monMotDePasse123"
 *                 description: Mot de passe (min 8 caractères)
 *               first_name:
 *                 type: string
 *                 example: "John"
 *                 description: Prénom de l'utilisateur
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *                 description: Nom de famille de l'utilisateur
 *               role_id:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *                 description: ID du rôle assigné à l'utilisateur
 *               assessor_id:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *                 description: ID de l'évaluateur associé
 *               is_active:
 *                 type: boolean
 *                 example: true
 *                 default: true
 *                 description: Statut actif/inactif de l'utilisateur
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "First user created successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439013"
 *                     username:
 *                       type: string
 *                       example: "john.doe"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     role_id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     assessor_id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439012"
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Erreur de validation ou utilisateur existe déjà
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingFields:
 *                 value:
 *                   error: "Username, password are required"
 *                   code: "MISSING_FIELDS"
 *               userExists:
 *                 value:
 *                   error: "User with this username already exists"
 *                   code: "USER_EXISTS"
 *               validationError:
 *                 value:
 *                   error: "Validation failed"
 *                   code: "VALIDATION_ERROR"
 *       401:
 *         description: Token requis ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               tokenRequired:
 *                 value:
 *                   error: "Token required for user creation when users exist in database"
 *                   code: "TOKEN_REQUIRED"
 *               invalidToken:
 *                 value:
 *                   error: "Invalid or expired token"
 *                   code: "INVALID_TOKEN"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


// Create user with special logic for first user
router.post("/", async (req, res) => {
  try {
    // Check if there are any users in the database
    const userCount = await User.countDocuments();
    
    // If there are existing users, require authentication
    if (userCount > 0) {
      // Check if authorization header is present
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ 
          error: "Token required for user creation when users exist in database",
          code: "TOKEN_REQUIRED"
        });
      }
      
      const token = authHeader.replace("Bearer ", "");

      try {
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET || "secretkey");
      } catch (err) {
        return res.status(401).json({ 
          error: "Invalid or expired token",
          code: "INVALID_TOKEN"
        });
      }
    }
    
    // Validate required fields
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ 
        error: "Username, password are required",
        code: "MISSING_FIELDS"
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: "User with this username already exists",
        code: "USER_EXISTS"
      });
    }
    
    // Create the user
    const user = new User(req.body);
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: userCount === 0 ? "First user created successfully" : "User created successfully",
      user: userResponse
    });
    
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: err.message,
        code: "VALIDATION_ERROR"
      });
    }
    res.status(500).json({ 
      error: "Internal server error",
      code: "INTERNAL_ERROR"
    });
  }
});

// Protect all other routes (GET, PUT, DELETE) - always require auth
router.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      error: "Token required",
      code: "TOKEN_REQUIRED"
    });
  }

  const token = authHeader.replace("Bearer ", "");
  
  try {
    jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    next();
  } catch (err) {
    return res.status(401).json({ 
      error: "Invalid or expired token",
      code: "INVALID_TOKEN"
    });
  }
});


/**
 * @swagger
 * /user:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs
 *     description: Retourne la liste de tous les utilisateurs (protégé par token JWT)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'utilisateurs par page
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "507f1f77bcf86cd799439013"
 *                   username:
 *                     type: string
 *                     example: "john.doe"
 *                   first_name:
 *                     type: string
 *                     example: "John"
 *                   last_name:
 *                     type: string
 *                     example: "Doe"
 *                   role_id:
 *                     type: object
 *                     description: Rôle de l'utilisateur peuplé
 *                   assessor_id:
 *                     type: object
 *                     description: Évaluateur associé peuplé
 *                   is_active:
 *                     type: boolean
 *                     example: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur interne du serveur
 */
// Read all (protected - always require auth)


router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("assessor_id role_id");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     description: Retourne les détails d'un utilisateur spécifique (protégé par token JWT)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */


// Read one (protected - always require auth)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("assessor_id role_id");
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     description: Met à jour les informations d'un utilisateur existant (protégé par token JWT)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john.doe.updated"
 *               first_name:
 *                 type: string
 *                 example: "John Updated"
 *               last_name:
 *                 type: string
 *                 example: "Doe Updated"
 *               role_id:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439014"
 *               assessor_id:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439015"
 *               is_active:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données invalides ou ID incorrect
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */


// Update (protected - always require auth)
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Supprime un utilisateur de la base de données (protégé par token JWT)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */


// Delete (protected - always require auth)
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;