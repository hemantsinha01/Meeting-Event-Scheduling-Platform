const { ObjectId } = require("mongodb")

const createEvent = async (req, res) => {
  try {
    const db = req.app.locals.db
    const eventsCollection = db.collection("events")
    const meetingsCollection = db.collection("meetings") // Add reference to meetings collection

    // Get the user ID from the token
    // This assumes the authMiddleware has been applied to this route
    let userId = null
    
    // Check if user info is available from the middleware
    if (req.user && req.user.id) {
      userId = req.user.id
    } else {
      // If token is directly available in the request
      const token = req.header("Authorization")
      if (token) {
        try {
          // Try to extract user ID from token if needed
          const jwt = require("jsonwebtoken")
          const decoded = jwt.verify(token, process.env.JWT_SECRET)
          userId = decoded.id
        } catch (tokenError) {
          console.error("Token verification error:", tokenError)
        }
      }
    }

    const {
      eventTopic,
      password,
      hostName,
      description,
      start_date,
      start_time,
      end_date,
      end_time,
      timezone,
      duration,
      bannerColor,
      link,
      emails,
    } = req.body

    if (!eventTopic || !hostName || !start_date || !start_time || !timezone) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Parse duration into hours and minutes
    let durationHours = 0
    let durationMinutes = 0

    if (duration) {
      // Handle format like "1 hour 30 min" or "45 min" or "2 hours"
      const hourMatch = duration.match(/(\d+)\s*hour/)
      const minMatch = duration.match(/(\d+)\s*min/)

      if (hourMatch) {
        durationHours = Number.parseInt(hourMatch[1], 10)
      }

      if (minMatch) {
        durationMinutes = Number.parseInt(minMatch[1], 10)
      }
    }

    // Calculate end date and time based on start date, start time, and duration
    const startDateTime = new Date(`${start_date}T${start_time}`)

    // Add duration
    startDateTime.setHours(startDateTime.getHours() + durationHours)
    startDateTime.setMinutes(startDateTime.getMinutes() + durationMinutes)

    // Format end date and time
    const finalEndDate = startDateTime.toISOString().split("T")[0]
    const finalEndTime = startDateTime.toTimeString().slice(0, 5)

    const newEvent = {
      eventTopic,
      password,
      hostName,
      description,
      start_date,
      start_time,
      end_date: finalEndDate,
      end_time: finalEndTime,
      timezone,
      duration,
      bannerColor,
      link,
      emails,
      createdAt: new Date(),
    }

    // Add userId to the event if available
    if (userId) {
      newEvent.userId = new ObjectId(userId)
    }

    const result = await eventsCollection.insertOne(newEvent)
    if (!result.acknowledged) {
      throw new Error("Failed to create event")
    }

    // Get the ID of the newly created event
    const eventId = result.insertedId

    // Store selected email IDs in the meetings collection with accepted status set to 2 (pending)
    if (emails && emails.length > 0) {
      // Get user records for the emails to get their user IDs
      const usersCollection = db.collection("users")

      // Create an array to store meeting entries
      const meetingEntries = []

      // For each email, find the corresponding user and create a meeting entry
      for (const email of emails) {
        // Find the user with this email
        const user = await usersCollection.findOne({ email })

        if (user) {
          // Create a meeting entry with user_id, meeting_id, accepted status, and attending status
          meetingEntries.push({
            user_id: user._id,
            meeting_id: eventId,
            accepted: 2, // 2 = pending
            attending: 1, // 1 = willing to attend (default)
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      }

      // Insert all meeting entries if there are any
      if (meetingEntries.length > 0) {
        await meetingsCollection.insertMany(meetingEntries)
      }
    }

    res.status(201).json({
      message: "Event created successfully and meeting invitations sent",
      event: newEvent,
    })
  } catch (error) {
    console.error("Server error in createEvent:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { createEvent }