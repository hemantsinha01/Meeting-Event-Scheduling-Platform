"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/Preferences.css"
import logo from "../assets/main.png"
import image1 from "../assets/image1.png"

const API_URL = process.env.REACT_APP_BACKEND_URL

const Preferences = () => {
  const [formData, setFormData] = useState({
    username: "",
    categories: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const categories = [
    { name: "Sales", icon: "\uD83D\uDCBC" },
    { name: "Education", icon: "\uD83C\uDF93" },
    { name: "Finance", icon: "\uD83D\uDCB0" },
    { name: "Government & Politics", icon: "\uD83C\uDFDB\uFE0F" },
    { name: "Consulting", icon: "\uD83D\uDCCA" },
    { name: "Recruiting", icon: "\uD83D\uDCDD" },
    { name: "Tech", icon: "\uD83D\uDCBB" },
    { name: "Marketing", icon: "\uD83D\uDE80" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: category,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username || !formData.categories) {
      setError("Please provide a username and select a category")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      await axios.post(
        `${API_URL}/preferences`,
        {
          username: formData.username,
          category: formData.categories,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )

      navigate("/events")
    } catch (error) {
      console.error("Error saving preferences:", error)
      setError(error.response?.data?.message || "Failed to save preferences. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="preferences-container">
      <div className="preferences-content">
        <div className="preferences-header">
          <img src={logo || "/placeholder.svg"} alt="CNNCT Logo" className="preferences-logo" />
          <h1>Your Preferences</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="preferences-form">
          <div className="form-section">
            <input
              type="text"
              value={formData.username}
              onChange={handleChange}
              name="username"
              placeholder="Tell us your username"
              className="preferences-input"
              required
            />
          </div>

          <div className="form-section">
            <label className="category-label">Select one category that best describes your CNNCT:</label>
            <div className="categories-grid">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  className={`category-button ${formData.categories === category.name ? "selected" : ""}`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-text">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="continue-button"
            disabled={!formData.username || !formData.categories || loading}
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>

      <div className="preferences-image" style={{ backgroundImage: `url(${image1})` }}>
      </div>
    </div>
  )
}

export default Preferences