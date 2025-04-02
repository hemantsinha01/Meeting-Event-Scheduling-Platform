"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/CreateEvent.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEventData = location.state || {};

  const [formData, setFormData] = useState({
    ...initialEventData,
    bannerColor: "#000000",
    link: "",
    emails: [],
  });

  const [emailOptions, setEmailOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState("100%");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");

  const predefinedColors = ["#ff6b00", "#ffffff", "#000000"];

  const fetchLoggedInUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/current-user`, {
        headers: { Authorization: token },
      });

      if (!response.ok) throw new Error("Failed to fetch user data");

      const userData = await response.json();
      setLoggedInUserEmail(userData.email);

      setFormData((prevData) => {
        if (!prevData.emails.includes(userData.email)) {
          return {
            ...prevData,
            emails: [...prevData.emails, userData.email],
          };
        }
        return prevData;
      });
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
  }, []);

  const fetchUserEmails = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setEmailOptions(data.map((user) => user.email));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchLoggedInUser();
    fetchUserEmails();
  }, [fetchLoggedInUser, fetchUserEmails]);

  useEffect(() => {
    if (showDropdown) {
      const inputContainer = document.querySelector(".email-input-container");
      if (inputContainer) {
        const rect = inputContainer.getBoundingClientRect();
        setDropdownWidth(`${rect.width}px`);
        setDropdownPosition({
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.left}px`,
        });
      }
    }
  }, [showDropdown]);

  const handleEmailSelection = (email) => {
    if (!formData.emails.includes(email)) {
      setFormData((prevData) => ({
        ...prevData,
        emails: [...prevData.emails, email],
      }));
    }
    setShowDropdown(false);
  };

  const removeEmail = (emailToRemove, e) => {
    e.stopPropagation();
    if (emailToRemove === loggedInUserEmail) return;

    setFormData((prevData) => ({
      ...prevData,
      emails: prevData.emails.filter((email) => email !== emailToRemove),
    }));
  };

  const handleColorChange = (color) => {
    setFormData((prevData) => ({ ...prevData, bannerColor: color }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      console.log("Event created successfully!");
      navigate("/events");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDropdown &&
        !event.target.closest(".email-input-container") &&
        !event.target.closest(".email-dropdown")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <Layout>
      <div className="create-event-page">
        <div className="create-event-form">
          <h2>Add Event</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Banner</h3>
              <div className="banner-preview" style={{ backgroundColor: formData.bannerColor }}>
                <h4>{formData.eventTopic}</h4>
              </div>

              <div className="color-picker">
                <label>Custom Background Color</label>
                <div className="color-options">
                  {predefinedColors.map((color, index) => (
                    <button
                      key={index}
                      className="color-btn"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleColorChange(color);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Add link *</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="link-input"
                  required
                />
              </div>

              <div className="form-group email-group">
                <label>Select Emails *</label>
                <div className="email-input-container" onClick={() => setShowDropdown(true)}>
                  <div className="email-tags-container">
                    {formData.emails.map((email, index) => (
                      <div key={index} className={`email-tag ${email === loggedInUserEmail ? "creator-email" : ""}`}>
                        {email}
                        {email === loggedInUserEmail ? (
                          <span className="creator-badge" title="Meeting Creator">👑</span>
                        ) : (
                          <button type="button" className="remove-email" onClick={(e) => removeEmail(email, e)}>
                            ❌
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <input type="text" className="email-input" placeholder={formData.emails.length ? "" : "Select emails..."} readOnly />
                </div>

                {showDropdown && (
                  <div className="email-dropdown" style={{ width: dropdownWidth, position: "absolute", top: "calc(100% + 5px)", left: 0, zIndex: 100 }}>
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
              <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="save-button">Save</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEvent;
