"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import "../styles/AddEvent.css"

const AddEvent = () => {
  const navigate = useNavigate()
  
  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    eventTopic: "",
    password: "",
    hostName: "",
    description: "",
    start_date: "",
    start_time: "",
    timezone: "(UTC +5:00 Delhi)",
    duration_hours: "1",
    duration_minutes: "0",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Combine hours and minutes for duration
    const combinedFormData = {
      ...formData,
      duration:
        formData.duration_hours > 0
          ? `${formData.duration_hours} hour${formData.duration_hours > 1 ? "s" : ""}${formData.duration_minutes > 0 ? ` ${formData.duration_minutes} min` : ""}`
          : `${formData.duration_minutes} min`,
    }

    navigate("/create-event", { state: combinedFormData })
  }

  return (
    <Layout>
      <div className="event-form-container">
        <div className="event-form-header">
          <h2>Add Event</h2>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="eventTopic">
              Event Topic <span className="required">*</span>
            </label>
            <input
              type="text"
              id="eventTopic"
              name="eventTopic"
              value={formData.eventTopic}
              onChange={handleChange}
              placeholder="Set a conference topic before it starts"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hostName">
              Host name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="hostName"
              name="hostName"
              value={formData.hostName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="start_date">
              Date and time <span className="required">*</span>
            </label>
            <div className="date-time-container">
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                min={today} // Restrict past date selection
                required
                className="date-picker"
              />
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="time-picker"
              />
              <select name="timezone" value={formData.timezone} onChange={handleChange} className="timezone-select">
                <option value="(UTC +5:00 Delhi)">(UTC +5:00 Delhi)</option>
                <option value="(UTC +0:00 London)">(UTC +0:00 London)</option>
                <option value="(UTC -5:00 New York)">(UTC -5:00 New York)</option>
                <option value="(UTC -8:00 Los Angeles)">(UTC -8:00 Los Angeles)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Set duration</label>
            <div className="duration-container">
              <div className="duration-input-group">
                <input
                  type="number"
                  id="duration_hours"
                  name="duration_hours"
                  value={formData.duration_hours}
                  onChange={handleChange}
                  min="0"
                  max="24"
                  className="duration-input"
                />
                <span className="duration-label">hours</span>
              </div>
              <div className="duration-input-group">
                <input
                  type="number"
                  id="duration_minutes"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  min="0"
                  max="59"
                  className="duration-input"
                />
                <span className="duration-label">minutes</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default AddEvent