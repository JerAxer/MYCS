const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Gestion des entreprises
 */

/**
 * @swagger
 * /company:
 *   post:
 *     summary: Créer une nouvelle entreprise
 *     description: Crée une nouvelle entreprise dans la base de données
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *           example:
 *             name: "Entreprise ABC"
 *             country_id: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Entreprise créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
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
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /company:
 *   get:
 *     summary: Récupérer toutes les entreprises
 *     description: Retourne la liste de toutes les entreprises
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom d'entreprise
 *       - in: query
 *         name: country_id
 *         schema:
 *           type: string
 *         description: Filtrer par ID de pays
 *     responses:
 *       200:
 *         description: Liste des entreprises récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", async (req, res) => {
  res.json(await Company.find());
});

/**
 * @swagger
 * /company/{id}:
 *   get:
 *     summary: Récupérer une entreprise par son ID
 *     description: Retourne les détails d'une entreprise spécifique
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'entreprise
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Entreprise trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Entreprise non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Not found" });
    res.json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /company/{id}:
 *   put:
 *     summary: Mettre à jour une entreprise
 *     description: Met à jour les informations d'une entreprise existante
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'entreprise à modifier
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *           example:
 *             name: "Entreprise ABC Modifiée"
 *             country_id: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Entreprise mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Données invalides ou ID incorrect
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Entreprise non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     summary: Supprimer une entreprise
 *     description: Supprime une entreprise de la base de données
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'entreprise à supprimer
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Entreprise supprimée avec succès
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
 *         description: Entreprise non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;