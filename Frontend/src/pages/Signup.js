import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";
import logo from "../assets/main.png";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/signup`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      navigate("/preferences");
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <img src={logo} alt="CNNCT" className="auth-logo" />
        </div>

        <div className="auth-title-section">
          <h1>Create an account</h1> 
          <Link to="/login" className="sign-in-link">Sign in instead</Link>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="auth-title">Create an account</h2>

          <div className="form-group">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className="auth-input" required />
          </div>

          <div className="form-group">
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className="auth-input" required />
          </div>

          <div className="form-group">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="auth-input" required />
          </div>

          <div className="form-group">
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="auth-input" required />
          </div>

          <div className="form-group">
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="auth-input" required />
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" name="agreeToTerms" id="terms" checked={formData.agreeToTerms} onChange={handleChange} required />
            <label htmlFor="terms">
              By creating an account, I agree to the <Link to="/terms">Terms of Use</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </label>
          </div>

          <button type="submit" className="auth-button" disabled={!formData.agreeToTerms || loading}>
            {loading ? "Creating Account..." : "Create an account"}
          </button>
        </form>
      </div>

      <div className="auth-image"></div>
    </div>
  );
};

export default Signup;
