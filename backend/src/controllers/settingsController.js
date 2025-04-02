const { ObjectId } = require("mongodb")
const bcrypt = require("bcryptjs")
const { hashPassword } = require("../models/userModel")

/**
 * Get user settings
 */
exports.getUserSettings = async (req, res) => {
  try {
    const db = req.app.locals.db
    const usersCollection = db.collection("users")

    // Get user ID from the authenticated request
    const userId = req.user.id

    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Return user data (excluding password)
    const { password, ...userData } = user
    res.status(200).json(userData)
  } catch (error) {
    console.error("Error fetching user settings:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

/**
 * Update user settings
 */
exports.updateUserSettings = async (req, res) => {
  try {
    const db = req.app.locals.db
    const usersCollection = db.collection("users")

    // Get user ID from the authenticated request
    const userId = req.user.id

    // Get updated data from request body
    const { username, firstName, lastName, email, password, notifications, theme } = req.body

    // Check if email is already in use by another user
    if (email) {
      const existingUser = await usersCollection.findOne({
        email,
        _id: { $ne: new ObjectId(userId) },
      })

      if (existingUser) {
        return res.status(400).json({ message: "Email already in use by another account" })
      }
    }

    // Update user data
    const updateData = {}
    if (username) updateData.username = username
    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (email) updateData.email = email
    if (notifications !== undefined) updateData.notifications = notifications
    if (theme) updateData.theme = theme

    // If password is provided, hash it before storing
    if (password) {
      updateData.password = await hashPassword(password)
    }

    const result = await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ message: "Settings updated successfully" })
  } catch (error) {
    console.error("Error updating user settings:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

/**
 * Delete user account
 */
exports.deleteUserAccount = async (req, res) => {
  try {
    const db = req.app.locals.db
    const usersCollection = db.collection("users")

    // Get user ID from the authenticated request
    const userId = req.user.id

    // Delete user from database
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting user account:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

