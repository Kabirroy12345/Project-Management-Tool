import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Sparkles,
  Layers,
  HelpCircle,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ collapsed }) => {
  const mainNavItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/team', icon: Users, label: 'Team' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  const toolsNavItems = [
    { path: '/analytics', icon: Sparkles, label: 'AI Insights', badge: 'New' },
    { path: '/kanban', icon: Layers, label: 'Kanban Board' },
  ];

  const bottomNavItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        {/* Main Navigation */}
        <div className="nav-section">
          <span className="nav-section-title">Main Menu</span>
          <ul className="nav-list">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  title={collapsed ? item.label : ''}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools Section */}
        <div className="nav-section">
          <span className="nav-section-title">Tools</span>
          <ul className="nav-list">
            {toolsNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  title={collapsed ? item.label : ''}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                  {!collapsed && item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="nav-section nav-section-bottom">
          <ul className="nav-list">
            {bottomNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  title={collapsed ? item.label : ''}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Card */}
        <div className="pro-card">
          <div className="pro-card-icon">
            <Sparkles size={24} />
          </div>
          <h4>Upgrade to Pro</h4>
          <p>Unlock AI features</p>
          <button className="pro-card-btn">Upgrade</button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
