import React, { useContext, useEffect, useState } from 'react';
import logo from '../../assets/images/logo_tunaskarier.png';
import { useNavigate } from 'react-router-dom';
import { SidebarContext } from '../../contexts/SidebarContext';
import { getProfile } from '../../apis/authApi';
import '../../styles/Global.css';

const CompanyNavbar = () => {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const [showHamburger, setShowHamburger] = useState(window.innerWidth < 1056);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setShowHamburger(window.innerWidth < 1056);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();
        if (response.status === 'success') {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  const handleToggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-end py-2">
      <div className="container-fluid">
        {showHamburger && (
          <button
            className="hamburger-btn"
            type="button"
            aria-label="Toggle sidebar"
            onClick={handleToggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>
        )}
        <a className="navbar-brand d-flex align-items-center" href="/company">
          <img src={logo} alt="Logo TunasKarier" style={{height:'38px',width:'auto'}} />
          <span className="ms-2 fw-bold text-primary">Company</span>
        </a>
        <div className="dropdown ms-auto">
          <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            {loading ? (
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : userProfile?.photo ? (
              <img 
                src={userProfile.photo} 
                alt="Profile" 
                className="rounded-circle"
                style={{width: '32px', height: '32px', objectFit: 'cover'}}
              />
            ) : (
              <i className="bi bi-person-circle fs-4 text-primary"></i>
            )}
          </a>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li className="dropdown-header">
              <strong>{userProfile?.full_name || 'Company'}</strong>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="/company/profile">Profil</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="/login" onClick={handleLogout}>Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CompanyNavbar; 