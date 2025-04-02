"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../styles/CalendarView.css"

const CalendarView = () => {
  const [currentView, setCurrentView] = useState("day") // Set default to day view
  const [searchQuery, setSearchQuery] = useState("")
  const [userEvents, setUserEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDay, setSelectedDay] = useState(0) // Default to first day (Sunday)

  const API_URL = process.env.REACT_APP_BACKEND_URL

  // Fetch user's calendar events
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          setError("Authentication required")
          setLoading(false)
          return
        }

        const response = await axios.get(`${API_URL}/calendar-events`, {
          headers: {
            Authorization: token,
          },
        })

        console.log("API Response:", response.data)

        // Process events for calendar display
        const processedEvents = response.data.map((event) => {
          // Parse start time
          const [hours, minutes] = event.start_time.split(":").map(Number)

          // Calculate duration in minutes
          const durationMinutes = Number.parseInt(event.duration) || 60

          // Get day of week from start_date
          const date = new Date(event.start_date)
          const dayOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.getDay()]

          // Determine color based on bannerColor or default to blue
          let type = "blue"
          if (event.bannerColor) {
            if (event.bannerColor.toLowerCase().includes("gray")) type = "gray"
            else if (event.bannerColor.toLowerCase().includes("purple")) type = "purple"
          }

          return {
            id: event._id,
            day: dayOfWeek,
            startTime: `${hours}:${minutes < 10 ? "0" + minutes : minutes}`,
            title: event.eventTopic,
            duration: durationMinutes,
            type: type,
            description: event.description || "",
            isAttending: event.isAttending,
          }
        })

        console.log("Processed Events:", processedEvents)
        setUserEvents(processedEvents)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching calendar events:", error)
        setError("Failed to load calendar events")
        setLoading(false)
      }
    }

    fetchCalendarEvents()
  }, [API_URL])

  // Create 24-hour time slots instead of just 8
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    return {
      time: `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`,
      hour24: hour,
    }
  })

  const days = [
    { day: "SUN", date: "23" },
    { day: "MON", date: "24" },
    { day: "TUE", date: "25" },
    { day: "WED", date: "26" },
    { day: "THU", date: "27" },
    { day: "FRI", date: "28" },
    { day: "SAT", date: "1" },
  ]

  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  const handleDaySelect = (index) => {
    setSelectedDay(index)
    setCurrentView("day")
  }

  const getEventStyle = (event) => {
    const [hours, minutes] = event.startTime.split(":").map(Number)
    const startMinutes = hours * 60 + minutes
    // Calculate based on 24 hours (1440 minutes) instead of 16 hours
    const startFromTop = (startMinutes / 1440) * 100
    const heightPercentage = (event.duration / 1440) * 100

    const colors = {
      gray: { bg: "#F3F4F6", text: "#111827", border: "#9CA3AF" },
      blue: { bg: "#EFF6FF", text: "#2563EB", border: "#60A5FA" },
      purple: { bg: "#F5F3FF", text: "#6D28D9", border: "#A78BFA" },
    }

    return {
      top: `${startFromTop}%`,
      height: `${heightPercentage}%`,
      backgroundColor: colors[event.type].bg,
      color: colors[event.type].text,
      borderLeft: `2px solid ${colors[event.type].border}`,
    }
  }

  const renderCalendarContent = () => {
    switch (currentView) {
      case "day":
        return (
          <div className="day-view">
            <div className="days-header">
              <div className="day-column">
                <div className="day-label">{days[selectedDay].day}</div>
                <div className="date-label">{days[selectedDay].date}</div>
              </div>
            </div>
            <div className="time-grid">
              <div className="time-labels">
                {timeSlots.map((slot) => (
                  <div key={slot.time} className="time-label">
                    {slot.time}
                  </div>
                ))}
              </div>
              <div className="grid-content">
                <div className="day-column">
                  {loading ? (
                    <div className="loading-indicator">Loading events...</div>
                  ) : error ? (
                    <div className="error-message">{error}</div>
                  ) : (
                    userEvents
                      .filter((event) => event.day === days[selectedDay].day)
                      .map((event, index) => (
                        <div key={index} className="event-item" style={getEventStyle(event)}>
                          <div className="event-title">{event.title}</div>
                          <div className="event-time">{event.startTime}</div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case "week":
        return (
          <div className="week-view">
            <div className="days-header">
              {days.map((day, index) => (
                <div key={day.day} className="day-column clickable" onClick={() => handleDaySelect(index)}>
                  <div className="day-label">{day.day}</div>
                  <div className="date-label">{day.date}</div>
                </div>
              ))}
            </div>
            <div className="time-grid">
              <div className="time-labels">
                {timeSlots.map((slot) => (
                  <div key={slot.time} className="time-label">
                    {slot.time}
                  </div>
                ))}
              </div>
              <div className="grid-content">
                {days.map((day) => (
                  <div key={day.day} className="day-column">
                    {userEvents
                      .filter((event) => event.day === day.day)
                      .map((event, index) => (
                        <div key={index} className="event-item" style={getEventStyle(event)}>
                          <div className="event-title">{event.title}</div>
                          <div className="event-time">{event.startTime}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "month":
        return (
          <div className="month-view">
            <div className="month-grid">
              {Array.from({ length: 35 }, (_, i) => {
                const date = i - 5 // Start from previous month's last days
                return (
                  <div key={i} className={`month-day ${date < 1 || date > 31 ? "other-month" : ""}`}>
                    <div className="date-number">{((date + 31) % 31) + 1}</div>
                    <div className="day-events">
                      {userEvents.map((event, index) => (
                        <div
                          key={index}
                          className="month-event"
                          style={{ backgroundColor: event.type === "blue" ? "#EFF6FF" : "#F3F4F6" }}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case "year":
        return (
          <div className="year-view">
            <div className="months-grid">
              {Array.from({ length: 12 }, (_, i) => {
                const monthNames = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ]
                return (
                  <div key={i} className="month-card">
                    <div className="month-name">{monthNames[i]}</div>
                    <div className="mini-month-grid">
                      {Array.from({ length: 31 }, (_, j) => (
                        <div key={j} className="mini-day">
                          {j + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button className="nav-btn">←</button>
          <button className="today-btn">Today</button>
          <button className="nav-btn">→</button>
        </div>

        <div className="view-options">
          <button className={currentView === "day" ? "active" : ""} onClick={() => handleViewChange("day")}>
            Day
          </button>
          <button className={currentView === "week" ? "active" : ""} onClick={() => handleViewChange("week")}>
            Week
          </button>
          <button className={currentView === "month" ? "active" : ""} onClick={() => handleViewChange("month")}>
            Month
          </button>
          <button className={currentView === "year" ? "active" : ""} onClick={() => handleViewChange("year")}>
            Year
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="calendar-grid">
        <div className="timezone-indicator">EST GMT-5</div>
        {renderCalendarContent()}
      </div>
    </div>
  )
}

export default CalendarView

