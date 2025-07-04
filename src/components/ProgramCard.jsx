import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Global.css';

const ProgramCard = ({ 
  id,
  companyLogo, 
  companyName, 
  position, 
  location, 
  positions, 
  tags = [], 
  duration, 
  workType, 
  createdAt,
  onClick,
  showDetailButton = false,
  showApplyButton = false,
  onApplyClick,
  className = '',
  userRole = 'company',
  alreadyApplied = false
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    if (id) {
      if (userRole === 'student') {
        navigate(`/student/programs/${id}`);
      } else {
        navigate(`/company/programs/${id}`);
      }
    }
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (onApplyClick) {
      onApplyClick(id);
    }
  };

  return (
    <div className={`col-12 col-md-6 col-lg-4 ${className}`}>
      <div 
        className={`card h-100 shadow-sm border-0 p-3 ${onClick ? 'cursor-pointer hover-lift' : ''}`}
        onClick={handleClick}
        style={{ transition: 'all 0.3s ease' }}
      >
        <div className="d-flex align-items-center mb-2">
          <img 
            src={companyLogo || 'https://via.placeholder.com/36x36?text=Logo'} 
            alt={`Logo ${companyName}`} 
            style={{
              height: '36px',
              width: 'auto',
              objectFit: 'contain'
            }} 
            className="me-2" 
          />
          <span className="text-muted small">{companyName}</span>
        </div>
        
        <div 
          className="fw-semibold fs-5 mb-1"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: '1.2'
          }}
          title={position}
        >
          {position}
        </div>
        <div className="text-muted mb-2">{location}</div>
        
        <div className="mb-2">
          <span className="text-primary small">{positions} Posisi</span>
        </div>
        
        <div className="mb-3 d-flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="badge rounded-pill bg-info-subtle text-info border border-info"
            >
              {tag}
            </span>
          ))}
          {duration && (
            <span className="badge rounded-pill bg-secondary-subtle text-secondary border">
              {duration}
            </span>
          )}
          {workType && (
            <span className="badge rounded-pill bg-light text-dark border">
              {workType}
            </span>
          )}
        </div>
        
        <hr className="my-2" />
        
        <div className="d-flex justify-content-between align-items-center">
          <div className="bg-light rounded px-2 py-1 small text-muted">
            <i className="bi bi-clock me-1"></i>
            {createdAt ? `Dibuat ${createdAt}` : 'Baru saja'}
          </div>
          <div className="d-flex gap-2">
            {showDetailButton && (
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={handleDetailClick}
              >
                <i className="bi bi-eye me-1"></i>Detail
              </button>
            )}
            {showApplyButton && (
              <button 
                className={`btn btn-sm ${alreadyApplied ? 'btn-success' : 'btn-primary'}`}
                onClick={handleApplyClick}
                disabled={alreadyApplied}
                title={alreadyApplied ? 'Program sudah diapply' : 'Apply ke program ini'}
                style={{
                  backgroundColor: alreadyApplied ? undefined : '#5ac1f4',
                  borderColor: alreadyApplied ? undefined : '#5ac1f4',
                  color: alreadyApplied ? undefined : 'white',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    backgroundColor: alreadyApplied ? undefined : '#4bb0e3',
                    borderColor: alreadyApplied ? undefined : '#4bb0e3'
                  }
                }}
                onMouseEnter={(e) => {
                  if (!alreadyApplied) {
                    e.target.style.backgroundColor = '#4bb0e3';
                    e.target.style.borderColor = '#4bb0e3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!alreadyApplied) {
                    e.target.style.backgroundColor = '#5ac1f4';
                    e.target.style.borderColor = '#5ac1f4';
                  }
                }}
              >
                <i className={`bi ${alreadyApplied ? 'bi-check-circle' : 'bi-send'} me-1`}></i>
                {alreadyApplied ? 'Applied' : 'Apply Program'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
