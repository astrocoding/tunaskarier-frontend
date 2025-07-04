import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarContext } from '../../contexts/SidebarContext';
import '../../styles/Global.css';

const CompanySidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const location = useLocation();
  const isMobile = window.innerWidth < 1056;

  // Function to check if a link is active
  const isActive = (path) => {
    if (path === '/company') {
      return location.pathname === '/company';
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
              className={`nav-link ${isActive('/company') && location.pathname === '/company' ? 'active' : ''}`} 
              href="/company"
            >
              <i className="bi bi-house me-2"></i>Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/company/mentors') ? 'active' : ''}`} 
              href="/company/mentors"
            >
              <i className="bi bi-person-badge me-2"></i>Mentors
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/company/applications') ? 'active' : ''}`} 
              href="/company/applications"
            >
              <i className="bi bi-inbox me-2"></i>Applications
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default CompanySidebar; 