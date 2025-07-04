import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarContext } from '../../contexts/SidebarContext';
import '../../styles/Global.css';

const MentorSidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const location = useLocation();
  const isMobile = window.innerWidth < 1056;

  // Function to check if a link is active
  const isActive = (path) => {
    if (path === '/mentor') {
      return location.pathname === '/mentor';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <nav className={`border-end sidebar${isMobile && sidebarOpen ? ' open' : ''}`}>
        <ul className="nav flex-column mt-4 mt-md-0 navku">
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/mentor') && location.pathname === '/mentor' ? 'active' : ''}`} 
              href="/mentor"
            >
              <i className="bi bi-house me-2"></i>Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/mentor/programs') ? 'active' : ''}`} 
              href="/mentor/programs"
            >
              <i className="bi bi-journal-code me-2"></i>My Programs
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/mentor/students') ? 'active' : ''}`} 
              href="/mentor/students"
            >
              <i className="bi bi-people me-2"></i>Assigned Students
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/mentor/assessments') ? 'active' : ''}`} 
              href="/mentor/assessments"
            >
              <i className="bi bi-calendar-check me-2"></i>Assessments
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MentorSidebar;
