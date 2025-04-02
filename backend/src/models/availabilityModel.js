const { ObjectId } = require("mongodb")

/**
 * Schema for storing user availability
 * - userId: Reference to the user
 * - weeklyAvailability: Object containing availability for each day of the week
 *   - Each day has an isAvailable flag and an array of time slots
 *   - Each time slot has start and end times
 */
const availabilitySchema = {
  userId: ObjectId,
  weeklyAvailability: {
    sun: { isAvailable: Boolean, slots: [{ start: String, end: String }] },
    mon: { isAvailable: Boolean, slots: [{ start: String, end: String }] },
    tue: { isAvailable: Boolean, slots: [{ start: String, end: String }] },
    wed: { isAvailable: Boolean, slots: [{ start: String, end: String }] },
    thu: { isAvailable: Boolean, slots: [{ start: String, end: String }] },
    fri: { isAvailable: Boolean, slots: [{ start: String, end: String }] },
    sat: { isAvailable: Boolean, slots: [{ start: String, end: String }] },
  },
  createdAt: Date,
  updatedAt: Date,
}

/**
 * Create a new availability record or update if exists
 */
async function saveAvailability(db, userId, weeklyAvailability) {
  const availabilityCollection = db.collection("availability")

  // Check if user already has availability set
  const existingAvailability = await availabilityCollection.findOne({ userId: new ObjectId(userId) })

  if (existingAvailability) {
    // Update existing availability
    return await availabilityCollection.updateOne(
      { userId: new ObjectId(userId) },
      {
        $set: {
          weeklyAvailability,
          updatedAt: new Date(),
        },
      },
    )
  } else {
    // Create new availability
    return await availabilityCollection.insertOne({
      userId: new ObjectId(userId),
      weeklyAvailability,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

/**
 * Get availability for a specific user
 */
async function getAvailabilityByUserId(db, userId) {
  const availabilityCollection = db.collection("availability")
  return await availabilityCollection.findOne({ userId: new ObjectId(userId) })
}

module.exports = {
  availabilitySchema,
  saveAvailability,
  getAvailabilityByUserId,
}

