import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Moon, Sun, Save, Camera, HelpCircle, Mail, Phone, ExternalLink } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Load state from localStorage or defaults
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userParams');
    return saved ? JSON.parse(saved) : {
      firstName: 'Kabir',
      lastName: 'Roy',
      email: 'kabir.roy@projectflow.com',
      phone: '+91 98765 43210',
      role: 'Project Lead',
      bio: '',
    };
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notificationParams');
    return saved ? JSON.parse(saved) : {
      email: true,
      push: true,
      taskUpdates: true,
      projectUpdates: false,
      weeklyReport: true,
    };
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('userParams', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('notificationParams', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);


  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      alert('Profile saved successfully!');
    }, 500);
  };

  const userInitials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <SettingsIcon size={32} />
            Settings
          </h1>
          <p>Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-section move-in">
              <h2>Profile Settings</h2>
              <p className="section-description">Manage your personal information</p>

              <div className="profile-header">
                <div className="avatar-upload">
                  <div className="current-avatar">{userInitials}</div>
                  <button className="upload-btn">
                    <Camera size={16} />
                    Change
                  </button>
                </div>
              </div>

              <form className="settings-form" onSubmit={handleProfileSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <input type="text" value={profile.role} disabled />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    rows="4"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={handleProfileChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section move-in">
              <h2>Notification Preferences</h2>
              <p className="section-description">Choose how you want to be notified</p>

              <div className="notification-options">
                {Object.keys(notifications).map(key => (
                  <div key={key} className="notification-item">
                    <div className="notification-info">
                      <h4 style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <p>Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications[key]}
                        onChange={() => handleNotificationChange(key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="settings-section move-in">
              <h2>Security Settings</h2>
              <p className="section-description">Manage your account security</p>

              <form className="settings-form" onSubmit={(e) => { e.preventDefault(); alert("Password updated!"); }}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>

                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  Update Password
                </button>
              </form>

              <div className="security-info">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
                <button className="btn btn-secondary">Enable 2FA</button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="settings-section move-in">
              <h2>Appearance</h2>
              <p className="section-description">Customize the look and feel</p>

              <div className="theme-options">
                <h3>Theme</h3>
                <div className="theme-cards">
                  <div className={`theme-card ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
                    <div className="theme-preview light">
                      <Sun size={24} />
                    </div>
                    <span>Light</span>
                  </div>
                  <div className={`theme-card ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
                    <div className="theme-preview dark">
                      <Moon size={24} />
                    </div>
                    <span>Dark</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help & Support Tab */}
          {activeTab === 'help' && (
            <div className="settings-section move-in">
              <h2>Help & Support</h2>
              <p className="section-description">Get in touch with our team</p>

              <div className="support-card">
                <h3>Contact Support</h3>
                <p>Need help with your project? Contact our lead developer directly.</p>

                <div className="contact-details">
                  <div className="contact-item">
                    <User size={20} className="contact-icon" />
                    <div>
                      <h4>Kabir Roy</h4>
                      <p>Lead Developer</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Phone size={20} className="contact-icon" />
                    <div>
                      <h4>Phone</h4>
                      <p>701117187</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Mail size={20} className="contact-icon" />
                    <div>
                      <h4>Email</h4>
                      <a href="mailto:rakeshkabir@gmail.com">rakeshkabir@gmail.com</a>
                    </div>
                  </div>
                </div>

                <div className="support-actions">
                  <button className="btn btn-primary">
                    <ExternalLink size={18} />
                    Visit Documentation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;