import React from 'react';

const StudentFooter = () => {
  return (
    <footer className="admin-footer-sticky bg-white border-top py-3 mt-5">
      <div className="container-fluid">
        <div className="text-end text-muted">
          &copy; {new Date().getFullYear()} <b>TunasKarier</b> - Company Portal
        </div>
      </div>
      <style>{`
        .admin-footer-sticky {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1030;
        }
        @media (max-width: 768px) {
          .admin-footer-sticky {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default StudentFooter;
