import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/student/StudentNavbar';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentFooter from '../../components/student/StudentFooter';
import '../../styles/DashboardAdmin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    appliedPrograms: 3,
    activeMentors: 2,
    completedSessions: 8,
    progress: 85
  });

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <StudentNavbar />
        <div className="container-fluid">
          <div className="row">
            <StudentSidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-2">
                      <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">Dashboard</h2>
                </div>
              </div>

              {/* Welcome Section */}
              <div className="row mt-5">
                <div className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-white border-bottom">
                      <h5 className="card-title mb-0 text-primary">
                        <i className="bi bi-emoji-smile me-2"></i>
                        Selamat Datang di <b>TunasKarier</b>!
                      </h5>
                    </div>
                    <div className="card-body">
                      <p className="text-muted mb-4">
                        Anda dapat melihat program yang diikuti, mentor yang membimbing, 
                        dan progress pembelajaran Anda. Gunakan sidebar untuk navigasi ke berbagai fitur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-white border-bottom">
                      <h5 className="card-title mb-0 text-primary">
                        <i className="bi bi-lightning me-2"></i>
                        Quick Actions
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <a href="/student/programs/applied" className="btn btn-outline-primary w-100 py-3">
                            <i className="bi bi-journal-code fs-4 d-block mb-2"></i>
                            Lihat Applied Programs
                          </a>
                        </div>
                        <div className="col-md-4">
                          <a href="/student/assessments" className="btn btn-outline-success w-100 py-3">
                            <i className="bi bi-calendar-check fs-4 d-block mb-2"></i>
                            Lihat Assessments
                          </a>
                        </div>
                        <div className="col-md-4">
                          <a href="/student/profile" className="btn btn-outline-info w-100 py-3">
                            <i className="bi bi-person-circle fs-4 d-block mb-2"></i>
                            Lihat Profile
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <StudentFooter />
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage; 