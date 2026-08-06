import { useState } from 'react';
import './CalendarView.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026 default

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get weekday of 1st day (0 = Sun, 1 = Mon, ..., 6 = Sat)
  // Convert to Mon=0, Tue=1, ..., Sun=6 layout
  const rawFirstDay = new Date(year, month, 1).getDay();
  const paddingDays = rawFirstDay === 0 ? 6 : rawFirstDay - 1;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Content Schedule</h2>
        <div className="calendar-nav">
          <button className="nav-btn" onClick={handlePrevMonth}>&lt;</button>
          <span>{monthNames[month]} {year}</span>
          <button className="nav-btn" onClick={handleNextMonth}>&gt;</button>
        </div>
      </div>
      <div className="calendar-grid">
        {DAYS.map((day) => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {/* Render empty slots for days before the 1st of the month */}
        {Array.from({ length: paddingDays }).map((_, idx) => (
          <div key={`padding-${idx}`} className="calendar-cell empty-cell"></div>
        ))}

        {/* Render actual days of the month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          return (
            <div key={dayNum} className="calendar-cell">
              <span className="date-num">{dayNum}</span>
              {month === 7 && dayNum === 5 && <div className="event-pill">10:42 AM Case Study</div>}
              {month === 7 && dayNum === 11 && <div className="event-pill">04:30 PM Analytics</div>}
              {month === 7 && dayNum === 19 && <div className="event-pill">06:00 PM Reel Release</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}