import React, { useState } from 'react';
import Layout from '../components/Layout';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import '../styles/CalendarView.css';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock data for meetings
  const meetings = [
    {
      id: 1,
      title: 'Team Standup',
      description: 'Weekly team sync meeting',
      date: new Date(2024, 2, 20, 10, 0),
      link: 'https://meet.google.com/abc-defg-hij',
      password: null,
      status: 'active'
    },
    {
      id: 2,
      title: 'Client Presentation',
      description: 'Present Q1 results to client',
      date: new Date(2024, 2, 21, 14, 0),
      link: 'https://zoom.us/j/123456789',
      password: 'client123',
      status: 'active'
    },
    {
      id: 3,
      title: 'Project Review',
      description: 'Review project milestones',
      date: new Date(2024, 2, 22, 11, 0),
      link: 'https://meet.google.com/xyz-uvwx-yz',
      password: null,
      status: 'pending'
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const getMeetingsForDay = (date) => {
    return meetings.filter(meeting => isSameDay(meeting.date, date));
  };

  const formatTime = (date) => {
    return format(date, 'h:mm a');
  };

  return (
    <Layout>
      <div className="calendar-page">
        <div className="calendar-header">
          <div className="calendar-title">
            <button className="btn btn-secondary" onClick={handlePrevMonth}>
              Previous
            </button>
            <h2>{format(currentDate, 'MMMM yyyy')}</h2>
            <button className="btn btn-secondary" onClick={handleNextMonth}>
              Next
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>

          <div className="calendar-days">
            {days.map((day, index) => {
              const dayMeetings = getMeetingsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isCurrentDay ? 'today' : ''}`}
                >
                  <div className="day-number">{format(day, 'd')}</div>
                  <div className="day-meetings">
                    {dayMeetings.map(meeting => (
                      <div
                        key={meeting.id}
                        className={`meeting-item ${meeting.status}`}
                        title={meeting.title}
                      >
                        <div className="meeting-time">
                          {formatTime(meeting.date)}
                        </div>
                        <div className="meeting-title">
                          {meeting.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color active"></div>
            <span>Active Meeting</span>
          </div>
          <div className="legend-item">
            <div className="legend-color pending"></div>
            <span>Pending Meeting</span>
          </div>
          <div className="legend-item">
            <div className="legend-color canceled"></div>
            <span>Canceled Meeting</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarView; 