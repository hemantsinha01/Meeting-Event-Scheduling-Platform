const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventTopic: { type: String, required: true },
  password: { type: String },
  hostName: { type: String, required: true },
  description: { type: String },
  start_date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_date: { type: String },
  end_time: { type: String },
  timezone: { type: String, required: true },
  duration: { type: String },
  bannerColor: { type: String, default: "#000000" },
  link: { type: String },
  emails: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
