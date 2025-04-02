const { ObjectId } = require("mongodb")

/**
 * Get all meetings for the logged-in user
 * Categorized as upcoming (accepted), pending, and cancelled
 */
const getUserMeetings = async (req, res) => {
  try {
    const db = req.app.locals.db
    const userId = req.user.id

    // Get collections
    const meetingsCollection = db.collection("meetings")
    const eventsCollection = db.collection("events")
    const usersCollection = db.collection("users")

    // Find all meetings for this user
    const userMeetings = await meetingsCollection
      .find({
        user_id: new ObjectId(userId),
      })
      .toArray()

    // Get all meeting IDs
    const meetingIds = userMeetings.map((meeting) => meeting.meeting_id)

    // Get event details for these meetings
    const events = await eventsCollection
      .find({
        _id: { $in: meetingIds.map((id) => new ObjectId(id)) },
      })
      .toArray()

    // Create a map of events for easy lookup
    const eventsMap = events.reduce((map, event) => {
      map[event._id.toString()] = event
      return map
    }, {})

    // Categorize meetings
    const upcoming = []
    const pending = []
    const cancelled = []

    // Process each meeting
    for (const meeting of userMeetings) {
      const event = eventsMap[meeting.meeting_id.toString()]

      if (!event) continue // Skip if event not found

      // Get all participants for this meeting
      const allParticipants = await meetingsCollection
        .find({
          meeting_id: meeting.meeting_id,
        })
        .toArray()

      // Get user details for participants
      const participantIds = allParticipants.map((p) => p.user_id)
      const participantUsers = await usersCollection
        .find({
          _id: { $in: participantIds },
        })
        .toArray()

      // Create a map of users for easy lookup
      const usersMap = participantUsers.reduce((map, user) => {
        map[user._id.toString()] = user
        return map
      }, {})

      // Format participants with acceptance status
      const participants = allParticipants.map((p) => {
        const user = usersMap[p.user_id.toString()]
        return {
          id: p.user_id.toString(),
          name: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
          email: user ? user.email : "",
          accepted: p.accepted, // 0 = rejected, 1 = accepted, 2 = pending
        }
      })

      // Format meeting data
      const meetingData = {
        id: meeting._id.toString(),
        meetingId: meeting.meeting_id.toString(),
        date: formatDate(event.start_date),
        time: `${event.start_time} - ${event.end_time}`,
        title: event.eventTopic,
        subtitle: `You and ${event.hostName}`,
        totalParticipants: participants.length,
        participants: participants,
        status: meeting.accepted, // 0 = rejected, 1 = accepted, 2 = pending
      }

      // Categorize based on acceptance status
      if (meeting.accepted === 1) {
        upcoming.push(meetingData)
      } else if (meeting.accepted === 2) {
        pending.push(meetingData)
      } else if (meeting.accepted === 0) {
        cancelled.push(meetingData)
      }
    }

    res.status(200).json({
      upcoming,
      pending,
      cancelled,
    })
  } catch (error) {
    console.error("Error fetching meetings:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

/**
 * Update meeting status (accept or reject)
 */
const updateMeetingStatus = async (req, res) => {
  try {
    const db = req.app.locals.db
    const userId = req.user.id
    const { meetingId, status } = req.body

    // Validate status
    if (status !== 0 && status !== 1) {
      return res.status(400).json({ message: "Invalid status. Must be 0 (reject) or 1 (accept)" })
    }

    // Update meeting status
    const meetingsCollection = db.collection("meetings")
    const result = await meetingsCollection.updateOne(
      {
        meeting_id: new ObjectId(meetingId),
        user_id: new ObjectId(userId),
      },
      {
        $set: {
          accepted: status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Meeting not found" })
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes made" })
    }

    res.status(200).json({
      message: status === 1 ? "Meeting accepted" : "Meeting rejected",
      status,
    })
  } catch (error) {
    console.error("Error updating meeting status:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

/**
 * Helper function to format date
 */
function formatDate(dateString) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const date = new Date(dateString)
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]

  return `${dayName}, ${day} ${month}`
}

module.exports = {
  getUserMeetings,
  updateMeetingStatus,
}

