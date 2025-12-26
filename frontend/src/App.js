import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import Team from './components/Team';
import Calendar from './components/Calendar';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import Kanban from './components/Kanban';
import Settings from './components/Settings';
import CustomCursor from './components/CustomCursor';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Router>
      <div className="App">
        <CustomCursor />
        <Navbar toggleSidebar={toggleSidebar} isSidebarCollapsed={sidebarCollapsed} />
        <div className="app-container">
          <Sidebar collapsed={sidebarCollapsed} />
          <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/team" element={<Team />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
