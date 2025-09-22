const express = require("express");
const router = express.Router();
const Privilege = require("../models/Privilege");

// CREATE
router.post("/", async (req, res) => {
  try {
    const privilege = new Privilege(req.body);
    await privilege.save();
    res.status(201).json(privilege);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const privileges = await Privilege.find();
    res.json(privileges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const privilege = await Privilege.findById(req.params.id);
    if (!privilege) return res.status(404).json({ error: "Privilege not found" });
    res.json(privilege);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!privilege) return res.status(404).json({ error: "Privilege not found" });
    res.json(privilege);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndDelete(req.params.id);
    if (!privilege) return res.status(404).json({ error: "Privilege not found" });
    res.json({ message: "Privilege deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
