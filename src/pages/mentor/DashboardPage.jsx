import React from 'react';
import MentorNavbar from '../../components/mentor/MentorNavbar';
import MentorSidebar from '../../components/mentor/MentorSidebar';
import MentorFooter from '../../components/mentor/MentorFooter';
import '../../styles/DashboardAdmin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';

const DashboardPage = () => {
  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <MentorNavbar />
        <div className="container-fluid">
          <div className="row">
            <MentorSidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{ marginTop: '60px', marginBottom: '100px'}}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                </ol>
              </nav>
              <h2 className="fw-bold mb-4 text-primary">Dashboard Mentor</h2>
              <div className="dashboard-cards">
                <div className="dashboard-card bg1 shadow">
                  <div className="icon text-primary"><i className="bi bi-journal-code"></i></div>
                  <div className="fs-5 fw-bold">8</div>
                  <div className="small text-muted">Program Aktif</div>
                </div>
                <div className="dashboard-card bg2 shadow">
                  <div className="icon text-success"><i className="bi bi-people"></i></div>
                  <div className="fs-5 fw-bold">24</div>
                  <div className="small text-muted">Siswa Dibimbing</div>
                </div>
              </div>
              
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Selamat Datang di Dashboard Mentor</h5>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">
                        Anda dapat mengelola program mentoring, melihat siswa yang dibimbing, 
                        dan mengatur jadwal sesi mentoring Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <MentorFooter />
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage; 