"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import Layout from "../components/Layout"
import "../styles/EditEvent.css"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const EditEvent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { eventId } = useParams()

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split("T")[0]

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
    bannerColor: "#000000",
    link: "",
    emails: [],
  })

  const [emailOptions, setEmailOptions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownWidth, setDropdownWidth] = useState("100%")
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("")
  const [loading, setLoading] = useState(true)

  const predefinedColors = ["#ff6b00", "#ffffff", "#000000"]

  // Fetch event data for editing
  const fetchEventData = useCallback(async () => {
    if (!eventId) return

    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No authentication token found")
        return
      }

      const response = await fetch(`${BACKEND_URL}/event/${eventId}`, {
        headers: { Authorization: token },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch event data")
      }

      const eventData = await response.json()

      // Parse duration into hours and minutes
      let duration_hours = "1"
      let duration_minutes = "0"

      if (eventData.duration) {
        const durationMatch = eventData.duration.match(/(\d+)\s*hour[s]?\s*(?:(\d+)\s*min)?/)
        if (durationMatch) {
          duration_hours = durationMatch[1] || "0"
          duration_minutes = durationMatch[2] || "0"
        } else {
          const minutesMatch = eventData.duration.match(/(\d+)\s*min/)
          if (minutesMatch) {
            duration_hours = "0"
            duration_minutes = minutesMatch[1] || "0"
          }
        }
      }

      setFormData({
        eventTopic: eventData.eventTopic || "",
        password: eventData.password || "",
        hostName: eventData.hostName || "",
        description: eventData.description || "",
        start_date: eventData.start_date || "",
        start_time: eventData.start_time || "",
        timezone: eventData.timezone || "(UTC +5:00 Delhi)",
        duration_hours,
        duration_minutes,
        bannerColor: eventData.bannerColor || "#000000",
        link: eventData.link || "",
        emails: eventData.emails || [],
      })
    } catch (error) {
      console.error("Error fetching event data:", error)
      alert(`Error: ${error.message || "Failed to load event data"}`)
      navigate("/events") // Redirect back to events page on error
    } finally {
      setLoading(false)
    }
  }, [eventId, navigate])

  const fetchLoggedInUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No authentication token found")
        return
      }

      const response = await fetch(`${BACKEND_URL}/current-user`, {
        headers: { Authorization: token },
      })

      if (!response.ok) throw new Error("Failed to fetch user data")

      const userData = await response.json()
      setLoggedInUserEmail(userData.email)

      setFormData((prevData) => {
        if (!prevData.emails.includes(userData.email)) {
          return {
            ...prevData,
            emails: [...prevData.emails, userData.email],
          }
        }
        return prevData
      })
    } catch (error) {
      console.error("Error fetching logged-in user:", error)
    }
  }, [])

  const fetchUserEmails = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users`)
      if (!response.ok) throw new Error("Failed to fetch users")

      const data = await response.json()
      setEmailOptions(data.map((user) => user.email))
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }, [])

  useEffect(() => {
    fetchEventData()
    fetchLoggedInUser()
    fetchUserEmails()
  }, [fetchEventData, fetchLoggedInUser, fetchUserEmails])

  useEffect(() => {
    if (showDropdown) {
      const inputContainer = document.querySelector(".email-input-container")
      if (inputContainer) {
        const rect = inputContainer.getBoundingClientRect()
        setDropdownWidth(`${rect.width}px`)
        setDropdownPosition({
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.left}px`,
        })
      }
    }
  }, [showDropdown])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleEmailSelection = (email) => {
    if (!formData.emails.includes(email)) {
      setFormData((prevData) => ({
        ...prevData,
        emails: [...prevData.emails, email],
      }))
    }
    setShowDropdown(false)
  }

  const removeEmail = (emailToRemove, e) => {
    e.stopPropagation()
    if (emailToRemove === loggedInUserEmail) return

    setFormData((prevData) => ({
      ...prevData,
      emails: prevData.emails.filter((email) => email !== emailToRemove),
    }))
  }

  const handleColorChange = (color) => {
    setFormData((prevData) => ({ ...prevData, bannerColor: color }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No authentication token found")
        return
      }

      // Combine hours and minutes for duration
      const combinedFormData = {
        ...formData,
        duration:
          formData.duration_hours > 0
            ? `${formData.duration_hours} hour${formData.duration_hours > 1 ? "s" : ""}${formData.duration_minutes > 0 ? ` ${formData.duration_minutes} min` : ""}`
            : `${formData.duration_minutes} min`,
      }

      const response = await fetch(`${BACKEND_URL}/update-event/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(combinedFormData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update event")
      }

      console.log("Event updated successfully!")
      navigate("/events")
    } catch (error) {
      console.error("Error:", error.message)
      alert(error.message)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".email-input-container") && !event.target.closest(".email-dropdown")) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Loading event data...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="edit-event-container">
        <div className="edit-event-header">
          <h2>Edit Event</h2>
        </div>

        <form onSubmit={handleSubmit} className="edit-event-form">
          <div className="form-section basic-info">
            <h3>Basic Information</h3>

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
                  min={today}
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
          </div>

          <div className="form-section advanced-settings">
            <h3>Advanced Settings</h3>

            <div className="banner-section">
              <h4>Banner</h4>
              <div className="banner-preview" style={{ backgroundColor: formData.bannerColor }}>
                <h4>{formData.eventTopic}</h4>
              </div>

              <div className="color-picker">
                <label>Custom Background Color</label>
                <div className="color-options">
                  {predefinedColors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-btn ${formData.bannerColor === color ? "active" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleColorChange(color)
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>
                Add link <span className="required">*</span>
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="link-input"
                required
              />
            </div>

            <div className="form-group email-group">
              <label>
                Select Emails <span className="required">*</span>
              </label>
              <div className="email-input-container" onClick={() => setShowDropdown(true)}>
                <div className="email-tags-container">
                  {formData.emails.map((email, index) => (
                    <div key={index} className={`email-tag ${email === loggedInUserEmail ? "creator-email" : ""}`}>
                      {email}
                      {email === loggedInUserEmail ? (
                        <span className="creator-badge" title="Meeting Creator">
                          👑
                        </span>
                      ) : (
                        <button type="button" className="remove-email" onClick={(e) => removeEmail(email, e)}>
                          ❌
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  className="email-input"
                  placeholder={formData.emails.length ? "" : "Select emails..."}
                  readOnly
                />
              </div>

              {showDropdown && (
                <div
                  className="email-dropdown"
                  style={{
                    width: dropdownWidth,
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    left: 0,
                    zIndex: 100,
                  }}
                >
                  {emailOptions
                    .filter((email) => !formData.emails.includes(email))
                    .map((email, index) => (
                      <div key={index} className="email-option" onClick={() => handleEmailSelection(email)}>
                        {email}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default EditEvent

