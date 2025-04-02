const { ObjectId } = require("mongodb");

/**
 * Get all meetings for the current user
 */
exports.getUserMeetings = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const meetingsCollection = db.collection("meetings");
    const eventsCollection = db.collection("events");
    const usersCollection = db.collection("users");

    // Get user ID from auth middleware
    const userId = new ObjectId(req.user.id);

    // Find all meetings for this user
    const userMeetings = await meetingsCollection
      .find({ user_id: userId })
      .toArray();

    // Get detailed information for each meeting
    const meetingsWithDetails = await Promise.all(
      userMeetings.map(async (meeting) => {
        try {
          // Get event details - handle potential null values
          const event = await eventsCollection.findOne({
            _id: new ObjectId(meeting.meeting_id),
          });

          if (!event) {
            return {
              ...meeting,
              event: {
                eventTopic: "Unknown Event",
                start_date: "N/A",
                start_time: "N/A",
                description: "Event details not available",
                isCreator: false,
              },
            };
          }

          // Ensure userId is properly retrieved
          const eventCreatorId = event.userId ? event.userId.toString() : null;
          const loggedInUserId = userId.toString();

          // Determine if the logged-in user is the creator
          const isCreator = eventCreatorId === loggedInUserId;

          // Get creator details if available
          let creatorName = "Unknown";
          let creatorEmail = "";

          if (event.userId) {
            const creator = await usersCollection.findOne({
              _id: new ObjectId(event.userId),
            });

            if (creator) {
              creatorName = `${creator.firstName} ${creator.lastName}`;
              creatorEmail = creator.email;
            }
          }

          // Debugging Log
          console.log(
            `Event: ${event.eventTopic}, eventCreatorId: ${eventCreatorId}, loggedInUserId: ${loggedInUserId}, isCreator: ${isCreator}`
          );

          return {
            ...meeting,
            event: {
              ...event,
              isCreator,
              creatorName,
              creatorEmail,
            },
          };
        } catch (err) {
          console.error("Error processing meeting:", err, meeting);
          return {
            ...meeting,
            event: {
              eventTopic: "Error Loading Event",
              start_date: "N/A",
              start_time: "N/A",
              description: "There was an error loading this event",
              isCreator: false,
              error: true,
            },
          };
        }
      })
    );

    res.status(200).json(meetingsWithDetails);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update meeting attendance status
 */
exports.updateAttendance = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const meetingsCollection = db.collection("meetings");

    const { meetingId, attending } = req.body;
    const userId = new ObjectId(req.user.id);

    // Validate attendance value
    if (attending !== 0 && attending !== 1) {
      return res.status(400).json({ message: "Invalid attendance value. Must be 0 or 1." });
    }

    // Update the meeting attendance
    const result = await meetingsCollection.updateOne(
      { _id: new ObjectId(meetingId), user_id: userId },
      { $set: { attending } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Meeting not found or you don't have permission" });
    }

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};