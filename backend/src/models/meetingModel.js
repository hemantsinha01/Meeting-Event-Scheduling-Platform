const mongoose = require("mongoose")

const meetingSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    accepted: { type: Number, enum: [0, 1, 2], default: 2 }, // 0 = rejected, 1 = accepted, 2 = pending
    attending: { type: Number, enum: [0, 1], default: 1 }, // 0 = not willing to attend, 1 = willing to attend
  },
  { timestamps: true },
)

module.exports = mongoose.model("Meeting", meetingSchema)

