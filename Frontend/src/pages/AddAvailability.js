"use client"

import { useState, useEffect } from "react"
import "../styles/AddAvailability.css"
import CalendarView from "../components/CalendarView"
import Layout from "../components/Layout"
import axios from "axios" // Make sure axios is installed

const AddAvailability = () => {
  const [selectedTab, setSelectedTab] = useState("availability")
  const [weeklyHours, setWeeklyHours] = useState({
    sun: { isAvailable: false, slots: [] },
    mon: { isAvailable: true, slots: [{ start: "", end: "" }] },
    tue: { isAvailable: true, slots: [{ start: "", end: "" }] },
    wed: { isAvailable: true, slots: [{ start: "", end: "" }] },
    thu: { isAvailable: true, slots: [{ start: "", end: "" }] },
    fri: { isAvailable: true, slots: [{ start: "", end: "" }] },
    sat: { isAvailable: true, slots: [{ start: "", end: "" }] },
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  // Fetch user's availability on component mount
  useEffect(() => {
    fetchAvailability()
  }, [])

  // Update the fetchAvailability function to use the full URL
  const fetchAvailability = async () => {
    try {
      setLoading(true)
      // Get token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        console.error("No authentication token found")
        return
      }

      const response = await axios.get("http://localhost:5000/api/auth/availability", {
        headers: {
          Authorization: token,
        },
      })

      if (response.data && response.data.weeklyAvailability) {
        setWeeklyHours(response.data.weeklyAvailability)
      }
    } catch (error) {
      console.error("Error fetching availability:", error)
      // If 404, it means no availability set yet, which is fine
      if (error.response && error.response.status !== 404) {
        setMessage({
          text: "Failed to load availability data",
          type: "error",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setSelectedTab(tab)
  }

  const handleAddTimeSlot = (day) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: "", end: "" }],
      },
    }))
  }

  const handleRemoveTimeSlot = (day, index) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }))
  }

  const handleTimeChange = (day, index, field, value) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
      },
    }))
  }

  const handleDayToggle = (day) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
      },
    }))
  }

  // Update the handleSubmit function to use the full URL
  const handleSubmit = async () => {
    try {
      setLoading(true)
      setMessage({ text: "", type: "" })

      // Get token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        setMessage({
          text: "You must be logged in to save availability",
          type: "error",
        })
        return
      }

      // Validate time slots
      let isValid = true
      Object.entries(weeklyHours).forEach(([day, { isAvailable, slots }]) => {
        if (isAvailable) {
          slots.forEach((slot) => {
            if (!slot.start || !slot.end) {
              isValid = false
            }
          })
        }
      })

      if (!isValid) {
        setMessage({
          text: "Please fill in all time slots or remove empty ones",
          type: "error",
        })
        return
      }

      // Send data to backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/availability",
        { weeklyAvailability: weeklyHours },
        {
          headers: {
            Authorization: token,
          },
        },
      )

      setMessage({
        text: "Availability saved successfully!",
        type: "success",
      })
    } catch (error) {
      console.error("Error saving availability:", error)
      setMessage({
        text: "Failed to save availability. Please try again.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="availability-container">
        <div className="availability-header">
          <h1>Availability</h1>
          <p>Configure times when you are available for bookings</p>

          <div className="tab-container">
            <button
              className={`tab-btn ${selectedTab === "availability" ? "active" : ""}`}
              onClick={() => handleTabChange("availability")}
            >
              <span className="tab-icon">☰</span> Availability
            </button>
            <button
              className={`tab-btn ${selectedTab === "calendar" ? "active" : ""}`}
              onClick={() => handleTabChange("calendar")}
            >
              <span className="tab-icon">📅</span> Calendar View
            </button>
          </div>
        </div>

        {selectedTab === "availability" ? (
          <div className="availability-content">
            <div className="section-header">
              <div className="activity-selector">
                <label>Activity</label>
                <select defaultValue="">
                  <option value="" disabled>
                    Event type →
                  </option>
                </select>
              </div>
              <div className="timezone-selector">
                <label>Time Zone</label>
                <select defaultValue="">
                  <option value="" disabled>
                    Indian Time Standard →
                  </option>
                </select>
              </div>
            </div>

            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

            <div className="weekly-hours">
              <h3>Weekly hours</h3>
              {Object.entries(weeklyHours).map(([day, { isAvailable, slots }]) => (
                <div key={day} className="day-row">
                  <div className="day-toggle">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={() => handleDayToggle(day)}
                      id={`toggle-${day}`}
                    />
                    <label htmlFor={`toggle-${day}`}>{day.toUpperCase()}</label>
                  </div>

                  {isAvailable ? (
                    <div className="time-slots-container">
                      {slots.map((slot, index) => (
                        <div key={index} className="time-slot-row">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => handleTimeChange(day, index, "start", e.target.value)}
                          />
                          <span>-</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => handleTimeChange(day, index, "end", e.target.value)}
                          />
                          <button className="remove-slot" onClick={() => handleRemoveTimeSlot(day, index)}>
                            ×
                          </button>
                          <button className="add-slot" onClick={() => handleAddTimeSlot(day)}>
                            +
                          </button>
                          <button className="copy-slot">□</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="unavailable-text">Unavailable</div>
                  )}
                </div>
              ))}
            </div>

            <div className="submit-container">
              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Availability"}
              </button>
            </div>
          </div>
        ) : (
          <CalendarView />
        )}
      </div>
    </Layout>
  )
}

export default AddAvailability

