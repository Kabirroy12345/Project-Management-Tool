import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Loader } from 'lucide-react';
import './Calendar.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/tasks`);
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks for calendar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Convert tasks to events where possible
  // Assuming tasks have a 'dueDate' field. If not, we might need to simulate or update Task model.
  // The Task model has 'dueDate'.
  const events = tasks.map(task => {
    const date = new Date(task.dueDate || new Date()); // Fallback to today if no date
    return {
      id: task.id,
      title: task.title,
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      time: 'All Day',
      color: task.priority === 'High' ? '#ff758c' : task.priority === 'Medium' ? '#f2994a' : '#38ef7d',
      status: task.status
    };
  }).filter(event => event.status !== 'Completed'); // Only show pending/in-progress

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday:
          i === new Date().getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear()
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day) => {
    return events.filter(event =>
      event.date === day &&
      event.month === currentDate.getMonth() &&
      event.year === currentDate.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  // Upcoming events (Next 5 tasks sorted by date)
  const upcomingEvents = [...events]
    .filter(e => {
      const eventDate = new Date(e.year, e.month, e.date);
      return eventDate >= new Date().setHours(0, 0, 0, 0);
    })
    .sort((a, b) => new Date(a.year, a.month, a.date) - new Date(b.year, b.month, b.date))
    .slice(0, 5);

  return (
    <div className="calendar-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <CalendarIcon size={32} />
            Calendar
          </h1>
          <p>Schedule and track your project milestones</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader size={24} className="spin" />
          Loading calendar...
        </div>
      ) : (
        <>
          <div className="calendar-container">
            {/* Calendar Header */}
            <div className="calendar-header">
              <div className="month-nav">
                <button className="nav-btn" onClick={goToPreviousMonth}>
                  <ChevronLeft size={20} />
                </button>
                <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button className="nav-btn" onClick={goToNextMonth}>
                  <ChevronRight size={20} />
                </button>
              </div>
              <button className="today-btn" onClick={goToToday}>
                Today
              </button>
            </div>

            {/* Days of Week */}
            <div className="calendar-weekdays">
              {daysOfWeek.map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {days.map((day, index) => {
                const dayEvents = day.isCurrentMonth ? getEventsForDay(day.day) : [];
                return (
                  <div
                    key={index}
                    className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${selectedDate === day.day && day.isCurrentMonth ? 'selected' : ''}`}
                    onClick={() => day.isCurrentMonth && setSelectedDate(day.day)}
                  >
                    <span className="day-number">{day.day}</span>
                    {dayEvents.length > 0 && (
                      <div className="day-events">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="event-dot"
                            style={{ background: event.color }}
                            title={event.title}
                          ></div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="more-events">+{dayEvents.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="upcoming-events">
            <h3>Upcoming Tasks</h3>
            {upcomingEvents.length === 0 ? (
              <p className="no-events">No upcoming tasks scheduled.</p>
            ) : (
              <div className="events-list">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-color" style={{ background: event.color }}></div>
                    <div className="event-details">
                      <h4>{event.title}</h4>
                      <span>
                        <Clock size={14} />
                        {months[event.month]} {event.date}, {event.year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;