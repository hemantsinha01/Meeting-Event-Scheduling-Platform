const { ObjectId } = require("mongodb")

/**
 * Get the current user's information
 */
const getCurrentUser = async (req, res) => {
  try {
    const db = req.app.locals.db
    const usersCollection = db.collection("users")
    const userId = req.user.id

    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Return user data without password
    const { password, ...userData } = user

    res.status(200).json(userData)
  } catch (error) {
    console.error("Error fetching current user:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { getCurrentUser }

