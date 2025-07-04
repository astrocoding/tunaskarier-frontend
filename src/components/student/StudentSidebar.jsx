import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarContext } from '../../contexts/SidebarContext';
import '../../styles/Global.css';

const StudentSidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const location = useLocation();
  const isMobile = window.innerWidth < 1056;

  // Function to check if a link is active
  const isActive = (path) => {
    if (path === '/student') {
      return location.pathname === '/student';
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
              className={`nav-link ${isActive('/student') && location.pathname === '/student' ? 'active' : ''}`} 
              href="/student"
            >
              <i className="bi bi-house me-2"></i>Dashboard
            </a>
          </li>
          
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/student/programs') && !location.pathname.includes('/applied') ? 'active' : ''}`} 
              href="/student/programs"
            >
              <i className="bi bi-journal-code me-2"></i>Programs
            </a>
          </li>
          
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/student/programs/applied') ? 'active' : ''}`} 
              href="/student/programs/applied"
            >
              <i className="bi bi-journal-check me-2"></i>Applied Programs
            </a>
          </li>

          {/* <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/student/mentors') ? 'active' : ''}`} 
              href="/student/mentors"
            >
              <i className="bi bi-journal-check me-2"></i>Assigned Mentors
            </a>
          </li>
           */}

          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/student/assessments') ? 'active' : ''}`} 
              href="/student/assessments"
            >
              <i className="bi bi-calendar-check me-2"></i>Assessments
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default StudentSidebar;
