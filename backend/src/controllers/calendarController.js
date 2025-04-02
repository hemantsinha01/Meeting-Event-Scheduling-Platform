const { ObjectId } = require("mongodb")

/**
 * Get calendar events for the currently logged-in user
 */
exports.getUserCalendarEvents = async (req, res) => {
  try {
    const db = req.app.locals.db
    const userId = req.user.id

    // Get user email
    const usersCollection = db.collection("users")
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const userEmail = user.email
    console.log("Fetching events for user email:", userEmail)

    // Find events where the user's email is in the emails array
    const eventsCollection = db.collection("events")
    const events = await eventsCollection
      .find({
        emails: userEmail,
      })
      .toArray()

    console.log("Found events:", events.length)

    // Get meeting status for each event
    const meetingsCollection = db.collection("meetings")

    // Process events to include attendance status
    const processedEvents = await Promise.all(
      events.map(async (event) => {
        // Find the meeting for this event
        const meeting = await meetingsCollection.findOne({
          meeting_id: event._id,
        })

        // Check if user is attending (accepted = 1)
        const isAttending = meeting && meeting.accepted === 1

        console.log(`Event ${event.eventTopic}: isAttending=${isAttending}`)

        return {
          ...event,
          isAttending,
          // Convert MongoDB ObjectId to string for JSON response
          _id: event._id.toString(),
          userId: event.userId.toString(),
        }
      }),
    )

    // Return all events for debugging purposes
    res.status(200).json(processedEvents)
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

