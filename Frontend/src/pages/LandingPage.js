import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import logo from '../assets/main.png';
import previewImage from '../assets/img_1.png';
import calendarImage from '../assets/img_2.png';
import visualImage from '../assets/img_3.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="CNNCT" className="logo-image" />
        </div>
        <button className="sign-in-btn" onClick={() => navigate('/login')}>Sign In</button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>CNNCT - Easy Scheduling Ahead</h1>
        <button className="sign-up-btn" onClick={() => navigate('/signup')}>Sign Up Now</button>
      </section>

      {/* Scheduling Preview Section */}
      <section className="preview">
        <h2>Simplified scheduling for you and your team</h2>
        <p>CNNCT eliminates the back-and-forth of scheduling meetings so you can focus on what matters. Set your availability, share your link, and let others book time with you instantly</p>
        <div className="preview-image">
          <img src={previewImage} alt="Scheduling Interface Preview" />
        </div>
      </section>

      {/* Calendar Organization Section */}
      <section className="calendar-org">
        <div className="calendar-content">
          <h2>Stay Organized with Your Calendar & Meetings</h2>
          <div className="calendar-details">
            <p className="subtitle">Seamless Event Scheduling</p>
            <ul>
              <li>View all your upcoming meetings and appointments in one place.</li>
              <li>Syncs with Google Calendar, Outlook, and iCloud to avoid conflicts.</li>
              <li>Customize event types: one-on-ones, team meetings, group sessions, and webinars.</li>
            </ul>
          </div>
        </div>
        <div className="calendar-mockups">
          <div className="calendar-device calendar-left">
            <div className="calendar-screen">
              <div className="time-slots">
                <div className="time-slot">9:00 AM</div>
                <div className="time-slot">10:00 AM</div>
                <div className="time-slot">11:00 AM</div>
                <div className="time-slot">12:00 PM</div>
                <div className="time-slot">1:00 PM</div>
                <div className="time-slot">2:00 PM</div>
                <div className="time-slot">3:00 PM</div>
              </div>
              <div className="events">
                <div className="event event-blue" style={{ top: '60px', height: '80px' }}>
                  Coffee Chat
                </div>
                <div className="event event-purple" style={{ top: '180px', height: '100px' }}>
                  Team Workshop
                </div>
                <div className="event event-pink" style={{ top: '320px', height: '60px' }}>
                  Happy Hour
                </div>
              </div>
            </div>
          </div>
          <div className="calendar-device calendar-right">
            <div className="calendar-screen">
              <div className="time-slots">
                <div className="time-slot">9:00 AM</div>
                <div className="time-slot">10:00 AM</div>
                <div className="time-slot">11:00 AM</div>
                <div className="time-slot">12:00 PM</div>
                <div className="time-slot">1:00 PM</div>
                <div className="time-slot">2:00 PM</div>
                <div className="time-slot">3:00 PM</div>
              </div>
              <div className="events">
                <div className="event event-red" style={{ top: '100px', height: '90px' }}>
                  Product Meeting
                </div>
                <div className="event event-blue" style={{ top: '240px', height: '70px' }}>
                  1:1 with Sarah
                </div>
                <div className="event event-purple" style={{ top: '350px', height: '80px' }}>
                  Design Review
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="testimonials-header">
          <h2>Here's what our <span className="highlight">customer</span> has to says</h2>
          <button className="read-stories-btn">Read customer stories</button>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>Amazing tool! Saved me months</p>
            <p className="testimonial-desc">This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <span className="author-name">John Master</span>
                <span className="author-title">Director, SpartTeam</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p>Amazing tool! Saved me months</p>
            <p className="testimonial-desc">This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <span className="author-name">John Master</span>
                <span className="author-title">Director, SpartTeam</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p>Amazing tool! Saved me months</p>
            <p className="testimonial-desc">This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <span className="author-name">John Master</span>
                <span className="author-title">Director, SpartTeam</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p>Amazing tool! Saved me months</p>
            <p className="testimonial-desc">This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <span className="author-name">John Master</span>
                <span className="author-title">Director, SpartTeam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="integrations">
        <h2>All Link Apps and Integrations</h2>
        <div className="integrations-grid">
          <div className="integration-item">
            <div className="integration-icon authentik"></div>
            <h3>Authentik</h3>
            <p>Add an Authentik adapter to your calendar</p>
          </div>
          <div className="integration-item">
            <div className="integration-icon brandmeister"></div>
            <h3>Brandmeister</h3>
            <p>More brand identity for your events</p>
          </div>
          <div className="integration-item">
            <div className="integration-icon beefree"></div>
            <h3>Beefree</h3>
            <p>Really style up your analytics emails</p>
          </div>
          <div className="integration-item">
            <div className="integration-icon books"></div>
            <h3>Books</h3>
            <p>Save books to your iBooks</p>
          </div>
          <div className="integration-item">
            <div className="integration-icon gift"></div>
            <h3>Buy Me a Gift</h3>
            <p>Get users to support you with a gift</p>
          </div>
          <div className="integration-item">
            <div className="integration-icon games"></div>
            <h3>Games</h3>
            <p>Make it enjoyable for connections</p>
          </div>
          <div className="integration-item">
            <div className="integration-icon clubhouse"></div>
            <h3>Clubhouse</h3>
            <p>Let your community in on the conversation</p>
          </div>
          <div className="integration-item">
            <div className="integration-icon community"></div>
            <h3>Community</h3>
            <p>Build on SDK subscriber list</p>
          </div>
          <div className="integration-item">
            <div className="integration-icon contact"></div>
            <h3>Contact Details</h3>
            <p>Easily share downloadable contact details</p>
          </div>
        </div>
      </section>

      {/* Footer with Sign Up */}
      <section className="signup-footer">
        <div className="signup-content">
          <div className="signup-left">
            <button className="login-btn">Log in</button>
            <button className="signup-btn">Sign up free</button>
          </div>
          <div className="footer-nav">
            <div className="nav-column">
              <h4>About CNNCT</h4>
              <ul>
                <li>Blog</li>
                <li>Pricing</li>
                <li>About</li>
                <li>Press & Media</li>
              </ul>
            </div>
            <div className="nav-column">
              <h4>Getting Started</h4>
              <ul>
                <li>Features and How-tos</li>
                <li>FAQs</li>
                <li>Report a violation</li>
                <li>Report a problem</li>
              </ul>
            </div>
            <div className="nav-column">
              <h4>Terms and Conditions</h4>
              <ul>
                <li>Privacy Policy</li>
                <li>Cookie Notice</li>
                <li>Terms of Use</li>
                <li>Brand Guide</li>
              </ul>
            </div>
          </div>
          <div className="social-links">
            <a href="#" className="social-icon twitter"></a>
            <a href="#" className="social-icon instagram"></a>
            <a href="#" className="social-icon tiktok"></a>
            <a href="#" className="social-icon facebook"></a>
            <a href="#" className="social-icon linkedin"></a>
          </div>
        </div>
      </section>

      {/* Acknowledgment Statement */}
      <section className="acknowledgment">
        <div className="acknowledgment-content">
          <p><strong>We acknowledge the Traditional Custodians of the land on which our office stands, The Wurundjeri people of the Kulin Nation, and pay our respects to Elders past, present and emerging.</strong></p>
          <div className="social-icons">
            <a href="#" aria-label="Twitter"><div className="social-icon icon-twitter"></div></a>
            <a href="#" aria-label="Instagram"><div className="social-icon icon-instagram"></div></a>
            <a href="#" aria-label="YouTube"><div className="social-icon icon-youtube"></div></a>
            <a href="#" aria-label="TikTok"><div className="social-icon icon-tiktok"></div></a>
            <a href="#" aria-label="Podcast"><div className="social-icon icon-podcast"></div></a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 