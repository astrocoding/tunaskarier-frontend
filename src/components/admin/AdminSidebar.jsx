import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarContext } from '../../contexts/SidebarContext';
import '../../styles/Global.css';

const AdminSidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const location = useLocation();
  const isMobile = window.innerWidth < 1056;

  // Function to check if a link is active
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
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
              className={`nav-link ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`} 
              href="/admin"
            >
              <i className="bi bi-house me-2"></i>Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/admin/admins') ? 'active' : ''}`} 
              href="/admin/admins"
            >
              <i className="bi bi-shield-lock me-2"></i>Admins
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/admin/students') ? 'active' : ''}`} 
              href="/admin/students"
            >
              <i className="bi bi-people me-2"></i>Students
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/admin/companies') ? 'active' : ''}`} 
              href="/admin/companies"
            >
              <i className="bi bi-building me-2"></i>Companies
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/admin/mentors') ? 'active' : ''}`} 
              href="/admin/mentors"
            >
              <i className="bi bi-person-badge me-2"></i>Mentors
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/admin/programs') ? 'active' : ''}`} 
              href="/admin/programs"
            >
              <i className="bi bi-journal-code me-2"></i>Programs
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${isActive('/admin/applications') ? 'active' : ''}`} 
              href="/admin/applications"
            >
              <i className="bi bi-inbox me-2"></i>Applications
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default AdminSidebar; 