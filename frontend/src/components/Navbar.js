import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, User, Menu, Zap, AlignLeft } from 'lucide-react';
import axios from 'axios';
import './Navbar.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Navbar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch dynamic notifications based on tasks/projects
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const tasksRes = await axios.get(`${API_URL}/tasks`);
        const tasks = tasksRes.data;

        // Generate notifications from recent tasks
        // In a real app, this would come from a dedicated /notifications endpoint
        const recentTasks = tasks.slice(0, 5); // Get last 5 tasks
        const generatedNotifications = recentTasks.map(task => ({
          id: task.id,
          text: `New task: ${task.title}`,
          time: 'Recently',
          unread: true // Simulating unread status
        }));

        if (generatedNotifications.length === 0) {
          setNotifications([{ id: 0, text: 'Welcome to ProjectFlow Pro!', time: 'Just now', unread: false }]);
        } else {
          setNotifications(generatedNotifications);
        }

      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const userName = 'Kabir Roy';
  const userEmail = 'kabir.roy@projectflow.com';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(updated);
  };

  return (
    <nav className="navbar">
      <div className={`navbar-content ${isSidebarCollapsed ? 'expanded' : ''}`}>

        {/* Left Side: Brand & Toggle */}
        <div className="navbar-left">
          <button className="menu-toggle-btn" onClick={toggleSidebar}>
            <AlignLeft size={24} />
          </button>
          <a href="/" className="navbar-brand">
            <div className="brand-icon">
              <Zap size={24} />
            </div>
            <span className="brand-text">ProjectFlow</span>
            <span className="brand-pro">Pro</span>
          </a>
        </div>

        {/* Search */}
        <div className="navbar-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search projects, tasks, or team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-shortcut">⌘K</span>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Notifications */}
          <div className="navbar-dropdown">
            <button
              className={`navbar-btn ${unreadCount > 0 ? 'has-notification' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <button className="mark-read" onClick={markAllRead}>Mark all as read</button>
                </div>
                <div className="dropdown-content">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      >
                        <div className="notification-dot"></div>
                        <div className="notification-text">
                          <p>{notification.text}</p>
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-item">
                      <div className="notification-text">
                        <p>No new notifications</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="dropdown-footer">
                  <a href="/notifications">View all notifications</a>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <a href="/settings" className="navbar-btn">
            <Settings size={20} />
          </a>

          {/* User Menu */}
          <div className="navbar-dropdown">
            <button
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {userInitials}
            </button>

            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <div className="user-info">
                  <div className="user-avatar-lg">{userInitials}</div>
                  <div>
                    <h4>{userName}</h4>
                    <p>{userEmail}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <a href="/profile" className="dropdown-item">
                  <User size={16} />
                  My Profile
                </a>
                <a href="/settings" className="dropdown-item">
                  <Settings size={16} />
                  Settings
                </a>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout">
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle - Kept for smaller screens */}
        <button className="mobile-menu-toggle">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
