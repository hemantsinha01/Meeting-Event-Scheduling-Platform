import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

const NewMeetingModal = ({ isOpen, onClose, onSubmit, meeting = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    link: '',
    password: '',
    bannerColor: '#ffffff',
    bannerImage: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (meeting) {
      const date = new Date(meeting.date);
      setFormData({
        title: meeting.title,
        description: meeting.description,
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5),
        link: meeting.link,
        password: meeting.password || '',
        bannerColor: meeting.bannerColor || '#ffffff',
        bannerImage: meeting.bannerImage || null
      });
    }
  }, [meeting]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Meeting link is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const meetingData = {
        ...formData,
        date: `${formData.date}T${formData.time}:00`
      };
      onSubmit(meetingData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          bannerImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{meeting ? 'Edit Meeting' : 'New Meeting'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter meeting title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter meeting description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className={`form-control ${errors.date ? 'error' : ''}`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                className={`form-control ${errors.time ? 'error' : ''}`}
                value={formData.time}
                onChange={handleChange}
              />
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="link">Meeting Link</label>
            <input
              type="url"
              id="link"
              name="link"
              className={`form-control ${errors.link ? 'error' : ''}`}
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter meeting link (Google Meet, Zoom, etc.)"
            />
            {errors.link && <span className="error-message">{errors.link}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (Optional)</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter meeting password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bannerColor">Banner Color</label>
            <input
              type="color"
              id="bannerColor"
              name="bannerColor"
              value={formData.bannerColor}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bannerImage">Banner Image (Optional)</label>
            <input
              type="file"
              id="bannerImage"
              name="bannerImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.bannerImage && (
              <div className="image-preview">
                <img src={formData.bannerImage} alt="Banner preview" />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {meeting ? 'Update Meeting' : 'Create Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMeetingModal; 