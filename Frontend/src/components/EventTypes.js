"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/EventTypes.css"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const EventCard = ({ meeting, onToggleAttendance }) => {
  const navigate = useNavigate()
  const { _id, attending, event } = meeting
  const {
    eventTopic = "Untitled Event",
    start_date = "N/A",
    start_time = "N/A",
    end_time = "",
    description = "No description provided",
    isCreator = false,
  } = event || {}

  const cardStyle = attending === 1 ? { backgroundColor: "#EFF6FF" } : {}

  const handleToggleAttendance = async () => {
    onToggleAttendance(_id, attending === 1 ? 0 : 1)
  }

  const handleEditEvent = () => {
    // Pass the meeting ID which is the event ID
    navigate(`/edit-event/${event._id}`)
  }

  return (
    <div className="event-card" style={cardStyle}>
      <div className="event-header">
        <h3>{eventTopic}</h3>
        {isCreator && (
          <button className="edit-button" onClick={handleEditEvent}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="event-date">{start_date}</div>
      <div className="event-time">{`${start_time}${end_time ? ` - ${end_time}` : ""}`}</div>
      <div className="event-description">{description}</div>
      <div className="event-actions">
        <label className="switch">
          <input type="checkbox" checked={attending === 1} onChange={handleToggleAttendance} />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  )
}

const EventTypes = () => {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No authentication token found")

        const response = await axios.get(`${BACKEND_URL}/events`, {
          headers: { Authorization: token },
        })

        const acceptedMeetings = response.data.filter((meeting) => meeting.accepted === 1)
        setMeetings(acceptedMeetings)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching meetings:", err)
        setError("Failed to load meetings. Please try again later.")
        setLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  const handleToggleAttendance = async (meetingId, attendingValue) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      await axios.post(
        `${BACKEND_URL}/events/attendance`,
        { meetingId, attending: attendingValue },
        { headers: { Authorization: token } },
      )

      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting._id === meetingId ? { ...meeting, attending: attendingValue } : meeting,
        ),
      )
    } catch (err) {
      console.error("Error updating attendance:", err)
      alert("Failed to update attendance. Please try again.")
    }
  }

  if (loading) return <div className="event-types">Loading meetings...</div>
  if (error) return <div className="event-types">{error}</div>

  return (
    <div className="event-types">
      <div className="event-types-header">
        <div>
          <h2>Event Types</h2>
          <p>Create events to share for people to book on your calendar.</p>
        </div>
        <button className="add-event-button" onClick={() => navigate("/add-event")}>
          Add New Event
        </button>
      </div>
      <div className="event-cards">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <EventCard key={meeting._id} meeting={meeting} onToggleAttendance={handleToggleAttendance} />
          ))
        ) : (
          <p>No meetings found. Create a new event to get started.</p>
        )}
      </div>
    </div>
  )
}

export default EventTypes

