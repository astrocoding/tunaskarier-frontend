import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getDashboardData } from '../../apis/adminApi';
import '../../styles/DashboardAdmin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getDashboardData();
        setDashboardData(response.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat data dashboard');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <AdminNavbar />
          <div className="container-fluid">
            <div className="row">
              <AdminSidebar />
              <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb mb-2">
                        <li className="breadcrumb-item active text-primary">
                          Dashboard
                        </li>
                      </ol>
                    </nav>
                    <h2 className="fw-bold text-primary mb-0">
                      <i className="bi bi-speedometer2 me-2"></i>Ringkasan Data
                    </h2>
                  </div>
                </div>
                
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Memuat data dashboard...</p>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <AdminFooter />
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <AdminNavbar />
          <div className="container-fluid">
            <div className="row">
              <AdminSidebar />
              <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb mb-2">
                        <li className="breadcrumb-item active text-primary">
                          Dashboard
                        </li>
                      </ol>
                    </nav>
                    <h2 className="fw-bold text-primary mb-0">
                      <i className="bi bi-speedometer2 me-2"></i>Ringkasan Data
                    </h2>
                  </div>
                </div>
                
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <i className="bi bi-exclamation-triangle text-danger" style={{fontSize: '3rem'}}></i>
                    <h4 className="mt-3 text-danger">Error</h4>
                    <p className="text-muted">{error}</p>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <AdminFooter />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
    <div style={{background: '#f7fafd', minHeight: '100vh'}}>
      <AdminNavbar />
      <div className="container-fluid">
        <div className="row">
          <AdminSidebar />
          <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item active text-primary">
                      Dashboard
                    </li>
                  </ol>
                </nav>
                <h2 className="fw-bold text-primary mb-0">
                  <i className="bi bi-speedometer2 me-2"></i>Ringkasan Data
                </h2>
              </div>
            </div>
            
            <div className="dashboard-cards">
              <div className="dashboard-card bg1">
                <div className="icon text-info"><i className="bi bi-shield-lock"></i></div>
                <div className="fs-5 fw-bold">{dashboardData?.total_admins || 0}</div>
                <div className="small text-muted">Total Admin</div>
              </div>
              <div className="dashboard-card bg1">
                <div className="icon text-info"><i className="bi bi-people"></i></div>
                <div className="fs-5 fw-bold">{dashboardData?.total_students || 0}</div>
                <div className="small text-muted">Total Siswa</div>
              </div>
              <div className="dashboard-card bg1">
                <div className="icon text-info"><i className="bi bi-building"></i></div>
                <div className="fs-5 fw-bold">{dashboardData?.total_companies || 0}</div>
                <div className="small text-muted">Total Perusahaan</div>
              </div>
              <div className="dashboard-card bg1">
                <div className="icon text-info"><i className="bi bi-person-badge"></i></div>
                <div className="fs-5 fw-bold">{dashboardData?.total_mentors || 0}</div>
                <div className="small text-muted">Total Mentor</div>
              </div>
              <div className="dashboard-card bg1">
                <div className="icon text-info"><i className="bi bi-journal-code"></i></div>
                <div className="fs-5 fw-bold">{dashboardData?.total_programs || 0}</div>
                <div className="small text-muted">Total Program</div>
              </div>
              <div className="dashboard-card bg1">
                <div className="icon text-info"><i className="bi bi-inbox"></i></div>
                <div className="fs-5 fw-bold">{dashboardData?.total_applications || 0}</div>
                <div className="small text-muted">Total Applications</div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <AdminFooter />
    </div>
    </SidebarProvider>
  );
};

export default DashboardPage; 