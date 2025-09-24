const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Gestion des activités métiers
 */

/**
 * @swagger
 * /activity:
 *   post:
 *     summary: Créer une nouvelle activité
 *     description: Crée une nouvelle activité dans la base de données
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *           example:
 *             code: "MANUFACTURING"
 *             name: "Fabrication"
 *     responses:
 *       201:
 *         description: Activité créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activity'
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
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: Récupérer toutes les activités
 *     description: Retourne la liste de toutes les activités avec possibilité de filtrage
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Filtrer par code de l'activité
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom de l'activité
 *     responses:
 *       200:
 *         description: Liste des activités récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", async (req, res) => {
  res.json(await Activity.find());
});

/**
 * @swagger
 * /activity/{id}:
 *   get:
 *     summary: Récupérer une activité par son ID
 *     description: Retourne les détails d'une activité spécifique
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'activité
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Activité trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activity'
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Activité non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ error: "Not found" });
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /activity/{id}:
 *   put:
 *     summary: Mettre à jour une activité
 *     description: Met à jour les informations d'une activité existante
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'activité à modifier
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *           example:
 *             code: "MANUFACTURING_UPDATED"
 *             name: "Fabrication Industrielle"
 *     responses:
 *       200:
 *         description: Activité mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activity'
 *       400:
 *         description: Données invalides ou ID incorrect
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Activité non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /activity/{id}:
 *   delete:
 *     summary: Supprimer une activité
 *     description: Supprime une activité de la base de données
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: ID MongoDB de l'activité à supprimer
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Activité supprimée avec succès
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
 *         description: Activité non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;