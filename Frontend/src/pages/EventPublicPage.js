import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EventPublicPage.css';

const EventPublicPage = () => {
  const { eventId } = useParams();
  const [password, setPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(true);

  // Mock data for the event
  const event = {
    id: eventId,
    title: 'Team Standup Meeting',
    description: 'Weekly team sync meeting to discuss project progress and upcoming tasks.',
    date: '2024-03-20T10:00:00',
    duration: '30 minutes',
    host: 'John Doe',
    link: 'https://meet.google.com/abc-defg-hij',
    password: 'team123',
    bannerColor: '#2563eb',
    bannerImage: null
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === event.password) {
      setShowPasswordForm(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  if (showPasswordForm) {
    return (
      <div className="event-public-page">
        <div className="password-form-container">
          <h2>This meeting is password protected</h2>
          <p>Please enter the password to view meeting details</p>
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter meeting password"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Join Meeting
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="event-public-page">
      <div 
        className="event-banner"
        style={{ backgroundColor: event.bannerColor }}
      >
        {event.bannerImage && (
          <img src={event.bannerImage} alt="Event banner" />
        )}
      </div>

      <div className="event-content">
        <div className="event-header">
          <h1>{event.title}</h1>
          <div className="event-meta">
            <div className="meta-item">
              <span className="label">Date:</span>
              <span className="value">{formatDate(event.date)}</span>
            </div>
            <div className="meta-item">
              <span className="label">Duration:</span>
              <span className="value">{event.duration}</span>
            </div>
            <div className="meta-item">
              <span className="label">Host:</span>
              <span className="value">{event.host}</span>
            </div>
          </div>
        </div>

        <div className="event-description">
          <h2>About this meeting</h2>
          <p>{event.description}</p>
        </div>

        <div className="event-actions">
          <a 
            href={event.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
          >
            Join Meeting
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventPublicPage; 