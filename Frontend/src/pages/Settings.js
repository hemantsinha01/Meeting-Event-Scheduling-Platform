"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Layout from "../components/Layout"
import "../styles/Settings.css"

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL

const Settings = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }

        const response = await axios.get(`${API_BASE_URL}/settings`, {
          headers: { Authorization: token },
        })

        setFormData({
          username: response.data.username || "",
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
          password: "",
          confirmPassword: "",
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        alert("Failed to load user settings. Please try again.")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setSaving(true)

    try {
      const token = localStorage.getItem("token")
      const { confirmPassword, ...dataToSend } = formData

      await axios.put(`${API_BASE_URL}/settings`, dataToSend, {
        headers: { Authorization: token },
      })

      alert("Settings updated successfully")

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }))
    } catch (error) {
      console.error("Error updating settings:", error)
      alert("Failed to update settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${API_BASE_URL}/account`, {
        headers: { Authorization: token },
      })

      localStorage.removeItem("token")
      navigate("/signup")
    } catch (error) {
      console.error("Error deleting account:", error)
      alert("Failed to delete account. Please try again.")
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="settings-page">
          <div className="settings-loading">Loading user settings...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="settings-page">
        <div className="settings-header">
          <h2>Profile</h2>
          <p>Manage settings for your profile</p>
        </div>

        <div className="settings-content">
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="settings-section">
              <h3>Edit Profile</h3>
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="settings-section">
              <h3>Change Password</h3>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="settings-footer">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Settings
