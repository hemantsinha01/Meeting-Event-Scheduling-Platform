const { ObjectId } = require("mongodb")

/**
 * Update user preferences
 */
exports.updatePreferences = async (req, res) => {
  try {
    const db = req.app.locals.db
    const usersCollection = db.collection("users")

    // Get user ID from auth middleware
    const userId = req.user.id

    // Get username and category from request body
    const { username, category } = req.body

    // Validate input
    if (!username) {
      return res.status(400).json({ message: "Username is required" })
    }

    if (!category) {
      return res.status(400).json({ message: "Category is required" })
    }

    // Update user preferences in the database
    const result = await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { username, category } })

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      message: "Preferences updated successfully",
      username,
      category,
    })
  } catch (error) {
    console.error("Error updating preferences:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

