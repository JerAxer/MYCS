const express = require("express");
const router = express.Router();
const BusinessUnit = require("../models/BusinessUnit");

/**
 * @swagger
 * tags:
 *   name: BusinessUnits
 *   description: Gestion des unités métiers (Business Units)
 */

/**
 * @swagger
 * /businessunit:
 *   post:
 *     summary: Créer une nouvelle unité métier
 *     description: Crée une nouvelle unité métier dans la base de données
 *     tags: [BusinessUnits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusinessUnit'
 *           example:
 *             name: "Division Fabrication"
 *             description: "Division dédiée à la fabrication des produits"
 *             activity_id: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Unité métier créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessUnit'
 *       400:
 *         description: Données invalides
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
    const bu = new BusinessUnit(req.body);
    await bu.save();
    res.status(201).json(bu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /businessunit:
 *   get:
 *     summary: Récupérer toutes les unités métiers
 *     description: Retourne la liste de toutes les unités métiers avec possibilité de filtrage et population des relations
 *     tags: [BusinessUnits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom de l'unité métier
 *       - in: query
 *         name: activity_id
 *         schema:
 *           type: string
 *         description: Filtrer par ID de l'activité
 *     responses:
 *       200:
 *         description: Liste des unités métiers récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BusinessUnit'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", async (req, res) => {
  res.json(await BusinessUnit.find());
});

/**
 * @swagger
 * /businessunit/{id}:
 *   get:
 *     summary: Récupérer une unité métier par son ID
 *     description: Retourne les détails d'une unité métier spécifique avec population des relations
 *     tags: [BusinessUnits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'unité métier
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Unité métier trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessUnit'
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Unité métier non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:id", async (req, res) => {
  try {
    const bu = await BusinessUnit.findById(req.params.id);
    if (!bu) return res.status(404).json({ error: "Not found" });
    res.json(bu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /businessunit/{id}:
 *   put:
 *     summary: Mettre à jour une unité métier
 *     description: Met à jour les informations d'une unité métier existante
 *     tags: [BusinessUnits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'unité métier à modifier
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusinessUnit'
 *           example:
 *             name: "Division Fabrication Industrielle"
 *             description: "Division dédiée à la fabrication industrielle des produits"
 *             activity_id: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Unité métier mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessUnit'
 *       400:
 *         description: Données invalides ou ID incorrect
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Unité métier non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:id", async (req, res) => {
  try {
    const bu = await BusinessUnit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /businessunit/{id}:
 *   delete:
 *     summary: Supprimer une unité métier
 *     description: "Supprime une unité métier de la base de données. Attention : vérification des dépendances."
 *     tags: [BusinessUnits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'unité métier à supprimer
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Unité métier supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted successfully"
 *       400:
 *         description: ID invalide ou unité métier utilisée ailleurs
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Unité métier non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/:id", async (req, res) => {
  try {
    await BusinessUnit.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;