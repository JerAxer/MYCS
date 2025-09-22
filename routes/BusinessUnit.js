
const express = require("express");
const router = express.Router();
const BusinessUnit = require("../models/BusinessUnit");

router.post("/", async (req, res) => {
  try {
    const bu = new BusinessUnit(req.body);
    await bu.save();
    res.status(201).json(bu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  res.json(await BusinessUnit.find());
});

router.get("/:id", async (req, res) => {
  try {
    const bu = await BusinessUnit.findById(req.params.id);
    if (!bu) return res.status(404).json({ error: "Not found" });
    res.json(bu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const bu = await BusinessUnit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await BusinessUnit.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
