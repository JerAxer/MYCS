
const express = require("express");
const router = express.Router();
const Language = require("../models/Language");

router.post("/", async (req, res) => {
  try {
    const lang = new Language(req.body);
    await lang.save();
    res.status(201).json(lang);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  res.json(await Language.find());
});

router.get("/:id", async (req, res) => {
  try {
    const lang = await Language.findById(req.params.id);
    if (!lang) return res.status(404).json({ error: "Not found" });
    res.json(lang);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const lang = await Language.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lang);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Language.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
