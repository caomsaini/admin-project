const mongoose = require("mongoose");

const heatmapSchema = new mongoose.Schema({
  page: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Heatmap", heatmapSchema);