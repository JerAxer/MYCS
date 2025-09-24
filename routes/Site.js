const express = require("express");
const router = express.Router();
const Site = require("../models/Site");

/**
 * @swagger
 * tags:
 *   name: Sites
 *   description: Gestion des sites (établissements, usines, bureaux)
 */

/**
 * @swagger
 * /site:
 *   post:
 *     summary: Créer un nouveau site
 *     description: Crée un nouveau site dans la base de données
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Site'
 *           example:
 *             code: "SITE_PARIS"
 *             name: "Site de Paris"
 *             internal_code: "FR001"
 *             country_id: "507f1f77bcf86cd799439011"
 *             company_id: "507f1f77bcf86cd799439012"
 *             city: "Paris"
 *             address: "123 Avenue des Champs-Élysées"
 *     responses:
 *       201:
 *         description: Site créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
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
    const site = new Site(req.body);
    await site.save();
    res.status(201).json(site);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /site:
 *   get:
 *     summary: Récupérer tous les sites
 *     description: Retourne la liste de tous les sites avec possibilité de filtrage
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Filtrer par code du site
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom du site
 *       - in: query
 *         name: internal_code
 *         schema:
 *           type: string
 *         description: Filtrer par code interne
 *       - in: query
 *         name: country_id
 *         schema:
 *           type: string
 *         description: Filtrer par ID du pays
 *       - in: query
 *         name: company_id
 *         schema:
 *           type: string
 *         description: Filtrer par ID de l'entreprise
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filtrer par ville
 *     responses:
 *       200:
 *         description: Liste des sites récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Site'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", async (req, res) => {
  res.json(await Site.find());
});

/**
 * @swagger
 * /site/{id}:
 *   get:
 *     summary: Récupérer un site par son ID
 *     description: Retourne les détails d'un site spécifique
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB du site
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Site trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Site non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:id", async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) return res.status(404).json({ error: "Not found" });
    res.json(site);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /site/{id}:
 *   put:
 *     summary: Mettre à jour un site
 *     description: Met à jour les informations d'un site existant
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB du site à modifier
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Site'
 *           example:
 *             code: "SITE_PARIS_UPDATED"
 *             name: "Site de Paris - Siège Social"
 *             internal_code: "FR001A"
 *             city: "Paris 8ème"
 *             address: "456 Avenue de la Grande Armée"
 *     responses:
 *       200:
 *         description: Site mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       400:
 *         description: Données invalides ou ID incorrect
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Site non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:id", async (req, res) => {
  try {
    const site = await Site.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(site);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /site/{id}:
 *   delete:
 *     summary: Supprimer un site
 *     description: Supprime un site de la base de données
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB du site à supprimer
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Site supprimé avec succès
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
 *         description: Site non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/:id", async (req, res) => {
  try {
    await Site.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;