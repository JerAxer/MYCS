const express = require("express");
const router = express.Router();
const Role = require("../models/Role");

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestion des rôles utilisateurs et permissions
 */

/**
 * @swagger
 * /role:
 *   post:
 *     summary: Créer un nouveau rôle
 *     description: Crée un nouveau rôle dans la base de données
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *           example:
 *             code: "ADMIN"
 *             name: "Administrateur"
 *             description: "Accès complet à toutes les fonctionnalités"
 *     responses:
 *       201:
 *         description: Rôle créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Données invalides ou code déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/", async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Récupérer tous les rôles
 *     description: Retourne la liste de tous les rôles avec possibilité de filtrage
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Filtrer par code du rôle
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom du rôle
 *     responses:
 *       200:
 *         description: Liste des rôles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", async (req, res) => {
  res.json(await Role.find());
});

/**
 * @swagger
 * /role/{id}:
 *   get:
 *     summary: Récupérer un rôle par son ID
 *     description: Retourne les détails d'un rôle spécifique
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB du rôle
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Rôle trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Rôle non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ error: "Not found" });
    res.json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /role/{id}:
 *   put:
 *     summary: Mettre à jour un rôle
 *     description: Met à jour les informations d'un rôle existant
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB du rôle à modifier
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *           example:
 *             code: "SUPER_ADMIN"
 *             name: "Super Administrateur"
 *             description: "Accès complet avec droits étendus"
 *     responses:
 *       200:
 *         description: Rôle mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Données invalides ou ID incorrect
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Rôle non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /role/{id}:
 *   delete:
 *     summary: Supprimer un rôle
 *     description: Supprime un rôle de la base de données. Attention : ne peut pas être supprimé si des utilisateurs y sont associés.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB du rôle à supprimer
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Rôle supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted successfully"
 *       400:
 *         description: ID invalide ou rôle utilisé par des utilisateurs
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Rôle non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/:id", async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;