const express = require("express");
const Heatmap = require("../models/Heatmap");
const router = express.Router();

// Save heatmap data
router.post("/heatmaps", async (req, res) => {
  try {
    const { page, x, y } = req.body;

    const newPoint = new Heatmap({ page, x, y });
    await newPoint.save();

    res.status(201).json({ message: "Heatmap data saved", point: newPoint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch heatmap data for a page
router.get("/heatmaps/:page", async (req, res) => {
  try {
    const { page } = req.params;

    const heatmapData = await Heatmap.find({ page });
    res.status(200).json(heatmapData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;