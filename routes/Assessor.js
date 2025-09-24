const express = require("express");
const router = express.Router();
const Assessor = require("../models/Assessor");

// Create
router.post("/", async (req, res) => {
  try {
    const assessor = new Assessor(req.body);
    await assessor.save();
    res.status(201).json(assessor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get("/", async (req, res) => {
  try {
    const assessors = await Assessor.find();
    res.json(assessors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get("/:id", async (req, res) => {
  try {
    const assessor = await Assessor.findById(req.params.id);
    if (!assessor) return res.status(404).json({ error: "Not found" });
    res.json(assessor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const assessor = await Assessor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(assessor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Assessor.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
