const express = require("express");
const router = express.Router();
const Country = require("../models/Country");

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: Gestion des pays
 */

/**
 * @swagger
 * /country:
 *   post:
 *     summary: Créer un nouveau pays
 *     description: Crée un nouveau pays dans la base de données
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *           example:
 *             area_id: "507f1f77bcf86cd799439011"
 *             code: "FR"
 *             name: "France"
 *             name_en: "France"
 *     responses:
 *       201:
 *         description: Pays créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
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
    const country = new Country(req.body);
    await country.save();
    res.status(201).json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /country:
 *   get:
 *     summary: Récupérer tous les pays
 *     description: Retourne la liste de tous les pays avec possibilité de filtrage
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Filtrer par code pays (ex: FR, US)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom du pays
 *       - in: query
 *         name: name_en
 *         schema:
 *           type: string
 *         description: Filtrer par nom anglais du pays
 *       - in: query
 *         name: area_id
 *         schema:
 *           type: string
 *         description: Filtrer par ID de la zone géographique
 *     responses:
 *       200:
 *         description: Liste des pays récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", async (req, res) => {
  res.json(await Country.find());
});

/**
 * @swagger
 * /country/{id}:
 *   get:
 *     summary: Récupérer un pays par son ID
 *     description: Retourne les détails d'un pays spécifique
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB du pays
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Pays trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Pays non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:id", async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ error: "Not found" });
    res.json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /country/{id}:
 *   put:
 *     summary: Mettre à jour un pays
 *     description: Met à jour les informations d'un pays existant
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB du pays à modifier
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *           example:
 *             area_id: "507f1f77bcf86cd799439012"
 *             code: "FR"
 *             name: "République Française"
 *             name_en: "French Republic"
 *     responses:
 *       200:
 *         description: Pays mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       400:
 *         description: Données invalides ou ID incorrect
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Pays non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:id", async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /country/{id}:
 *   delete:
 *     summary: Supprimer un pays
 *     description: Supprime un pays de la base de données
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB du pays à supprimer
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Pays supprimé avec succès
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
 *         description: Pays non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/:id", async (req, res) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;