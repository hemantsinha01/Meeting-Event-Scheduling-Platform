"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import "../styles/Layout.css"
import logo from "../assets/main.png"

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          navigate("/login")
          return
        }

        const response = await axios.get("http://localhost:5000/api/auth/current-user", {
          headers: { Authorization: token },
        })

        setUser(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data")
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  const getUserInitials = () => {
    if (!user) return ""
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`
  }

  const getFullName = () => {
    if (!user) return "Loading..."
    return `${user.firstName || ""} ${user.lastName || ""}`
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <Link to="/events" className="logo">
            <img src={logo || "/placeholder.svg"} alt="CNNCT" className="logo-img" />
          </Link>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/events" className={`nav-link ${isActive("/events") ? "active" : ""}`}>
              <i className="fas fa-link"></i>
              Events
            </Link>
          </li>
          <li>
            <Link to="/booking" className={`nav-link ${isActive("/booking") ? "active" : ""}`}>
              <i className="fas fa-calendar"></i>
              Booking
            </Link>
          </li>
          <li>
            <Link to="/availability" className={`nav-link ${isActive("/availability") ? "active" : ""}`}>
              <i className="far fa-clock"></i>
              Availability
            </Link>
          </li>
          <li>
            <Link to="/settings" className={`nav-link ${isActive("/settings") ? "active" : ""}`}>
              <i className="fas fa-cog"></i>
              Settings
            </Link>
          </li>
        </ul>

        <div className="sidebar-actions">
          <Link to="/add-event" className="create-btn">
            <i className="fas fa-plus"></i>
            Create
          </Link>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{getUserInitials()}</div>
            <div className="user-name">{getFullName()}</div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          {loading ? <div className="loading">Loading...</div> : error ? <div className="error">{error}</div> : children}
        </div>
      </main>
    </div>
  )
}

export default Layout