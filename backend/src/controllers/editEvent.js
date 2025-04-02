const { ObjectId } = require("mongodb")

/**
 * Get event by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEventById = async (req, res) => {
  try {
    const db = req.app.locals.db
    const eventsCollection = db.collection("events")
    const meetingsCollection = db.collection("meetings")
    const usersCollection = db.collection("users")

    const { eventId } = req.params

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" })
    }

    // Validate that the ID is a valid ObjectId
    let objectId
    try {
      objectId = new ObjectId(eventId)
    } catch (error) {
      return res.status(400).json({ message: "Invalid event ID format" })
    }

    // Find the event in the events collection first
    const event = await eventsCollection.findOne({
      _id: objectId,
    })

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Get all users who are invited to this event
    const meetingParticipants = await meetingsCollection
      .find({
        meeting_id: objectId,
      })
      .toArray()

    // If no participants found, just return the event with empty emails array
    let emails = []

    if (meetingParticipants && meetingParticipants.length > 0) {
      // Get the emails of all participants
      const participantIds = meetingParticipants.map((participant) => participant.user_id)
      const participants = await usersCollection
        .find({
          _id: { $in: participantIds },
        })
        .toArray()

      emails = participants.map((participant) => participant.email)
    }

    // Combine event data with emails
    const eventWithEmails = {
      ...event,
      emails,
    }

    res.status(200).json(eventWithEmails)
  } catch (error) {
    console.error("Error fetching event:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

/**
 * Update an existing event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateEvent = async (req, res) => {
  try {
    const db = req.app.locals.db
    const eventsCollection = db.collection("events")
    const meetingsCollection = db.collection("meetings")
    const usersCollection = db.collection("users")

    const { eventId } = req.params
    const userId = req.user.id

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" })
    }

    // Validate that the ID is a valid ObjectId
    let objectId
    try {
      objectId = new ObjectId(eventId)
    } catch (error) {
      return res.status(400).json({ message: "Invalid event ID format" })
    }

    // Check if the event exists
    const existingEvent = await eventsCollection.findOne({
      _id: objectId,
    })

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" })
    }

    const {
      eventTopic,
      password,
      hostName,
      description,
      start_date,
      start_time,
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

    // Update the event
    const updatedEvent = {
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
      updatedAt: new Date(),
    }

    const result = await eventsCollection.updateOne({ _id: objectId }, { $set: updatedEvent })

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      return res.status(400).json({ message: "Failed to update event" })
    }

    // Handle email participants
    if (emails && emails.length > 0) {
      try {
        // Get current participants
        const currentMeetings = await meetingsCollection
          .find({
            meeting_id: objectId,
          })
          .toArray()

        let currentEmails = []

        if (currentMeetings && currentMeetings.length > 0) {
          const currentParticipants = await usersCollection
            .find({
              _id: { $in: currentMeetings.map((m) => m.user_id) },
            })
            .toArray()

          currentEmails = currentParticipants.map((p) => p.email)
        }

        // Find emails to add (new emails)
        const emailsToAdd = emails.filter((email) => !currentEmails.includes(email))

        // Find emails to remove (emails no longer in the list)
        const emailsToRemove = currentEmails.filter((email) => !emails.includes(email))

        // Add new participants
        if (emailsToAdd.length > 0) {
          // Get user records for the emails to add
          const usersToAdd = await usersCollection
            .find({
              email: { $in: emailsToAdd },
            })
            .toArray()

          // Create meeting entries for new participants
          const meetingEntries = usersToAdd.map((user) => ({
            user_id: user._id,
            meeting_id: objectId,
            accepted: 2, // 2 = pending
            attending: 1, // 1 = willing to attend (default)
            createdAt: new Date(),
            updatedAt: new Date(),
          }))

          if (meetingEntries.length > 0) {
            await meetingsCollection.insertMany(meetingEntries)
          }
        }

        // Remove participants who are no longer in the list
        if (emailsToRemove.length > 0) {
          const usersToRemove = await usersCollection
            .find({
              email: { $in: emailsToRemove },
            })
            .toArray()

          if (usersToRemove.length > 0) {
            await meetingsCollection.deleteMany({
              meeting_id: objectId,
              user_id: { $in: usersToRemove.map((u) => u._id) },
            })
          }
        }
      } catch (emailError) {
        console.error("Error updating participants:", emailError)
        // Continue with the response even if participant update fails
      }
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: { ...updatedEvent, _id: objectId },
    })
  } catch (error) {
    console.error("Error updating event:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { getEventById, updateEvent }

