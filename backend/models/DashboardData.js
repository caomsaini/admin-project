const mongoose = require("mongoose");

const DashboardDataSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  statusData: [
    {
      title: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
  summaryData: [
    {
      title: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("DashboardData", DashboardDataSchema);
