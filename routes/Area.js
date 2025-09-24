const express = require("express");
const router = express.Router();
const Area = require("../models/Area");

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: Gestion des zones géographiques
 */

/**
 * @swagger
 * /area:
 *   post:
 *     summary: Créer une nouvelle zone géographique
 *     description: Crée une nouvelle zone géographique dans la base de données
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Area'
 *           example:
 *             name: "Europe"
 *     responses:
 *       201:
 *         description: Zone géographique créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
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
// Create
router.post("/", async (req, res) => {
  try {
    const area = new Area(req.body);
    await area.save();
    res.status(201).json(area);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /area:
 *   get:
 *     summary: Récupérer toutes les zones géographiques
 *     description: Retourne la liste de toutes les zones géographiques avec possibilité de filtrage
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom de la zone géographique
 *     responses:
 *       200:
 *         description: Liste des zones géographiques récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
// Read all
router.get("/", async (req, res) => {
  const areas = await Area.find();
  res.json(areas);
});

/**
 * @swagger
 * /area/{id}:
 *   get:
 *     summary: Récupérer une zone géographique par son ID
 *     description: Retourne les détails d'une zone géographique spécifique
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de la zone géographique
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Zone géographique trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Zone géographique non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
// Read one
router.get("/:id", async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ error: "Not found" });
    res.json(area);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /area/{id}:
 *   put:
 *     summary: Mettre à jour une zone géographique
 *     description: Met à jour les informations d'une zone géographique existante
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de la zone géographique à modifier
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Area'
 *           example:
 *             name: "Europe de l'Ouest"
 *     responses:
 *       200:
 *         description: Zone géographique mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       400:
 *         description: Données invalides ou ID incorrect
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Zone géographique non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
// Update
router.put("/:id", async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(area);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /area/{id}:
 *   delete:
 *     summary: Supprimer une zone géographique
 *     description: Supprime une zone géographique de la base de données
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de la zone géographique à supprimer
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Zone géographique supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted successfully"
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Zone géographique non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Area.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;