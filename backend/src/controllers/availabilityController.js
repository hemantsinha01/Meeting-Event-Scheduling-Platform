const { ObjectId } = require("mongodb")
const { saveAvailability, getAvailabilityByUserId } = require("../models/availabilityModel")

/**
 * Get user's availability
 */
const getUserAvailability = async (req, res) => {
  try {
    const db = req.app.locals.db
    const userId = req.user.id

    const availability = await getAvailabilityByUserId(db, userId)

    if (!availability) {
      return res.status(404).json({ message: "No availability found for this user" })
    }

    res.status(200).json(availability)
  } catch (error) {
    console.error("Error fetching availability:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

/**
 * Create or update user's availability
 */
const updateAvailability = async (req, res) => {
  try {
    const db = req.app.locals.db
    const userId = req.user.id
    const { weeklyAvailability } = req.body

    // Validate input
    if (!weeklyAvailability) {
      return res.status(400).json({ message: "Weekly availability is required" })
    }

    // Save availability
    const result = await saveAvailability(db, userId, weeklyAvailability)

    if (!result.acknowledged) {
      return res.status(500).json({ message: "Failed to save availability" })
    }

    res.status(200).json({
      message: "Availability updated successfully",
      availability: {
        userId,
        weeklyAvailability,
      },
    })
  } catch (error) {
    console.error("Error updating availability:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

/**
 * Delete a specific time slot from a day
 */
const deleteTimeSlot = async (req, res) => {
  try {
    const db = req.app.locals.db
    const userId = req.user.id
    const { day, slotIndex } = req.params

    // Validate day parameter
    const validDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    if (!validDays.includes(day)) {
      return res.status(400).json({ message: "Invalid day parameter" })
    }

    // Get current availability
    const availability = await getAvailabilityByUserId(db, userId)

    if (!availability) {
      return res.status(404).json({ message: "No availability found for this user" })
    }

    // Check if the slot exists
    const daySlots = availability.weeklyAvailability[day].slots
    if (!daySlots || slotIndex >= daySlots.length) {
      return res.status(404).json({ message: "Time slot not found" })
    }

    // Remove the slot
    const updatedSlots = daySlots.filter((_, index) => index !== Number.parseInt(slotIndex))

    // Update the availability
    const availabilityCollection = db.collection("availability")
    const updatePath = `weeklyAvailability.${day}.slots`

    const result = await availabilityCollection.updateOne(
      { userId: new ObjectId(userId) },
      {
        $set: {
          [updatePath]: updatedSlots,
          updatedAt: new Date(),
        },
      },
    )

    if (!result.acknowledged) {
      return res.status(500).json({ message: "Failed to delete time slot" })
    }

    res.status(200).json({
      message: "Time slot deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting time slot:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getUserAvailability,
  updateAvailability,
  deleteTimeSlot,
}

