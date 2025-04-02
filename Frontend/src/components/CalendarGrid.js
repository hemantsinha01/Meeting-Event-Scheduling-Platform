import React from 'react';
import '../styles/CalendarGrid.css';

const CalendarGrid = () => {
  // Mock data for calendar events
  const events = [
    {
      id: 1,
      title: 'Meeting',
      start: '10:00 AM',
      end: '11:00 AM',
      day: 'FRI',
      type: 'meeting',
    },
    {
      id: 2,
      title: 'Meeting-2',
      start: '2:00 PM',
      end: '3:00 PM',
      day: 'FRI',
      type: 'consultation',
    },
    {
      id: 3,
      title: 'Meeting-2',
      start: '10:00 AM',
      end: '11:00 AM',
      day: 'TUE',
      type: 'meeting',
    }
  ];

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  });

  // Generate days of the week
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const currentDate = new Date();
  const dates = days.map((day, index) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - currentDate.getDay() + index);
    return date.getDate();
  });

  const getEventStyle = (event) => {
    return {
      backgroundColor: event.type === 'meeting' ? '#EFF6FF' : '#F0FDF4',
      borderColor: event.type === 'meeting' ? '#2563EB' : '#16A34A',
      color: event.type === 'meeting' ? '#1E40AF' : '#166534',
    };
  };

  const getEventPosition = (event) => {
    const startHour = parseInt(event.start.split(':')[0]);
    const startMinutes = parseInt(event.start.split(':')[0]);
    const endHour = parseInt(event.end.split(':')[0]);
    const endMinutes = parseInt(event.end.split(':')[0]);
    
    const top = ((startHour - 9) * 60 + startMinutes) * (100 / 60);
    const height = ((endHour - startHour) * 60 + (endMinutes - startMinutes)) * (100 / 60);
    
    return { top: `${top}%`, height: `${height}%` };
  };

  return (
    <div className="calendar-grid-container">
      <div className="time-column">
        <div className="header-cell"></div>
        {timeSlots.map((time, index) => (
          <div key={index} className="time-cell">
            {time}
          </div>
        ))}
      </div>

      <div className="days-grid">
        <div className="days-header">
          {days.map((day, index) => (
            <div key={day} className="header-cell">
              <div className="day-name">{day}</div>
              <div className="date">{dates[index]}</div>
            </div>
          ))}
        </div>

        <div className="time-grid">
          {days.map((day) => (
            <div key={day} className="day-column">
              {timeSlots.map((_, index) => (
                <div key={index} className="grid-cell"></div>
              ))}
              {events
                .filter(event => event.day === day)
                .map(event => (
                  <div
                    key={event.id}
                    className="event"
                    style={{
                      ...getEventStyle(event),
                      ...getEventPosition(event)
                    }}
                  >
                    <div className="event-time">{event.start}</div>
                    <div className="event-title">{event.title}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid; 