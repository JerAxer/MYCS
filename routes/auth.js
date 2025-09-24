const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Gestion de l'authentification des utilisateurs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     description: Authentifie un utilisateur et retourne un token JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *           example:
 *             username: "admin"
 *             password: "motdepasse123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: Token JWT pour l'authentification
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     username:
 *                       type: string
 *                       example: "admin"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     role_id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439012"
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 expiresIn:
 *                   type: string
 *                   example: "24h"
 *       400:
 *         description: Données manquantes ou identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingCredentials:
 *                 value:
 *                   error: "Username and password are required."
 *                   code: "MISSING_CREDENTIALS"
 *               invalidCredentials:
 *                 value:
 *                   error: "Invalid credentials."
 *                   code: "INVALID_CREDENTIALS"
 *       403:
 *         description: Compte désactivé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Account is deactivated."
 *               code: "ACCOUNT_DEACTIVATED"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation des champs requis
    if (!username || !password) {
      return res.status(400).json({ 
        error: "Username and password are required.",
        code: "MISSING_CREDENTIALS"
      });
    }

    // Récupérer l'utilisateur + password (car select: false dans le modèle)
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(400).json({ 
        error: "Invalid credentials.",
        code: "INVALID_CREDENTIALS"
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.is_active) {
      return res.status(403).json({ 
        error: "Account is deactivated.",
        code: "ACCOUNT_DEACTIVATED"
      });
    }

    // Comparer mot de passe clair vs hash DB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        error: "Invalid credentials.",
        code: "INVALID_CREDENTIALS"
      });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username 
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    // Nettoyer la réponse (ne pas renvoyer le mot de passe)
    const userSafe = {
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role_id: user.role_id,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      token,
      user: userSafe,
      expiresIn: process.env.JWT_EXPIRES_IN || "24h"
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      error: "Internal server error during authentication.",
      code: "LOGIN_ERROR"
    });
  }
});


/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Vérifier la validité du token
 *     description: Vérifie si le token JWT est valide et retourne les informations de l'utilisateur
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     username:
 *                       type: string
 *                       example: "admin"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     role_id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439012"
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *                 valid:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Token invalide ou manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur interne du serveur
 */

// Vérifier le token (endpoint protégé)
router.get("/verify", auth, async (req, res) => {
  try {
    // Récupérer les informations utilisateur à jour
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
        is_active: user.is_active
      },
      valid: true
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(500).json({ error: "Token verification failed." });
  }
});

/**
 * @swagger
 * /auth/setup-status:
 *   get:
 *     summary: Vérifier le statut d'installation
 *     description: Vérifie si le premier utilisateur doit être créé (pour l'installation initiale)
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Statut récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstUserRequired:
 *                   type: boolean
 *                   description: True si aucun utilisateur n'existe dans la base
 *                   example: true
 *                 userCount:
 *                   type: integer
 *                   description: Nombre total d'utilisateurs dans la base
 *                   example: 0
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/setup-status", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ 
      firstUserRequired: userCount === 0,
      userCount: userCount
    });
  } catch (err) {
    console.error("Setup status error:", err);
    res.status(500).json({ error: "Error checking setup status." });
  }
});


/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Changer le mot de passe
 *     description: Permet à un utilisateur connecté de changer son mot de passe
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe actuel
 *                 example: "ancienMotDePasse"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Nouveau mot de passe (min 6 caractères)
 *                 example: "nouveauMotDePasse123"
 *     responses:
 *       200:
 *         description: Mot de passe changé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully."
 *       400:
 *         description: Données manquantes ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingData:
 *                 value:
 *                   error: "Current and new password are required."
 *               shortPassword:
 *                 value:
 *                   error: "New password must be at least 6 characters long."
 *               wrongPassword:
 *                 value:
 *                   error: "Current password is incorrect."
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
// Changer le mot de passe (protégé)
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long." });
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user.id).select("+password");
    
    // Vérifier le mot de passe actuel
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Error changing password." });
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rafraîchir le token
 *     description: Génère un nouveau token JWT avec une durée de validité renouvelée
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token rafraîchi avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: Nouveau token JWT
 *                 expiresIn:
 *                   type: string
 *                   example: "24h"
 *       401:
 *         description: Token invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/refresh", auth, async (req, res) => {
  try {
    // Générer un nouveau token
    const token = jwt.sign(
      { 
        id: req.user.id, 
        username: req.user.username 
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.json({
      success: true,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || "24h"
    });
  } catch (err) {
    console.error("Token refresh error:", err);
    res.status(500).json({ error: "Error refreshing token." });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion
 *     description: Déconnecte l'utilisateur (gestion côté client)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully."
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
// Logout (côté client généralement, mais on peut blacklister le token si nécessaire)
router.post("/logout", auth, async (req, res) => {
  try {
    // Dans une implémentation plus avancée, vous pourriez blacklister le token
    // Pour l'instant, on se contente de confirmer la déconnexion
    res.json({ 
      success: true, 
      message: "Logged out successfully." 
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Error during logout." });
  }
});


module.exports = router;