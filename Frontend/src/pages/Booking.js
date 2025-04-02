"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Layout from "../components/Layout"
import "../styles/Booking.css"

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL

const Booking = () => {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [meetings, setMeetings] = useState({
    upcoming: [],
    pending: [],
    cancelled: [],
    past: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      setError("")
      const token = localStorage.getItem("token")
      if (!token) {
        setError("You must be logged in to view meetings")
        setLoading(false)
        return
      }
      const response = await axios.get(`${API_BASE_URL}/meetings`, {
        headers: { Authorization: token },
      })
      setMeetings({ ...response.data, past: [] })
    } catch (error) {
      console.error("Error fetching meetings:", error)
      setError("Failed to load meetings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateMeetingStatus = async (meetingId, status) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("You must be logged in to update meetings")
        return
      }
      await axios.post(
        `${API_BASE_URL}/meetings/status`,
        { meetingId, status },
        { headers: { Authorization: token } }
      )
      fetchMeetings()
      setSelectedMeeting(null)
    } catch (error) {
      console.error("Error updating meeting status:", error)
      setError("Failed to update meeting. Please try again.")
    }
  }

  return (
    <Layout>
      <div className="booking-page">
        <div className="booking-header">
          <h1>Booking</h1>
          <p>See upcoming and past events booked through your event type links.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="booking-content">
          <div className="tabs">
            {["upcoming", "pending", "cancelled", "past"].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="meetings-list">
            {loading ? (
              <div className="loading-state">Loading meetings...</div>
            ) : meetings[activeTab].length > 0 ? (
              meetings[activeTab].map((meeting) => (
                <div key={meeting.id} className="meeting-card">
                  <div className="meeting-info">
                    <div className="meeting-date">{meeting.date}</div>
                    <div className="meeting-time">{meeting.time}</div>
                    <div className="meeting-title">{meeting.title}</div>
                    <div className="meeting-participants">
                      <button className="participants-btn" onClick={() => setSelectedMeeting(meeting)}>
                        {meeting.totalParticipants} people
                      </button>
                      {activeTab === "pending" && (
                        <div className="meeting-actions">
                          <button className="btn-reject" onClick={() => updateMeetingStatus(meeting.meetingId, 0)}>
                            Reject
                          </button>
                          <button className="btn-accept" onClick={() => updateMeetingStatus(meeting.meetingId, 1)}>
                            Accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No {activeTab} meetings</p>
              </div>
            )}
          </div>
        </div>

        {selectedMeeting && (
          <div className="modal-overlay" onClick={() => setSelectedMeeting(null)}>
            <div className="participants-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Participants ({selectedMeeting.participants.length})</h3>
                <button className="close-btn" onClick={() => setSelectedMeeting(null)}>×</button>
              </div>
              <div className="participants-list">
                {selectedMeeting.participants.map((participant) => (
                  <div key={participant.id} className="participant-item">
                    <div className="participant-info">
                      <div className="participant-avatar">{participant.name.charAt(0)}</div>
                      <span className="participant-name">{participant.name}</span>
                    </div>
                    <div className="participant-status">
                      {participant.accepted === 1 ? "✅" : "⬜"}
                    </div>
                  </div>
                ))}
              </div>
              {activeTab === "pending" && (
                <div className="modal-footer">
                  <button className="btn-reject" onClick={() => updateMeetingStatus(selectedMeeting.meetingId, 0)}>
                    Reject
                  </button>
                  <button className="btn-accept" onClick={() => updateMeetingStatus(selectedMeeting.meetingId, 1)}>
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Booking
