const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  location: { city: String, country: String, lat: Number, lng: Number },
  pagesVisited: [
    {
      url: { type: String, required: true },
      visitTime: { type: Date, default: Date.now },
      duration: { type: Number, default: 0 }, // Duration in seconds
    },
  ],
  isSinglePageVisit: { type: Boolean, default: false }, // For bounce rate calculation
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
});

module.exports = mongoose.model("Analytics", analyticsSchema);