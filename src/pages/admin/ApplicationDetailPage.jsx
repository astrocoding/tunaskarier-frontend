import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getApplicationById } from '../../apis/adminApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import '../../styles/Admin.css';

const ApplicationDetailPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await getApplicationById(applicationId);
        setApplication(response.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat data aplikasi');
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'registered': { class: 'bg-info', text: 'Terdaftar', icon: 'bi-clock' },
      'reviewing': { class: 'bg-warning', text: 'Sedang Ditinjau', icon: 'bi-eye' },
      'accepted': { class: 'bg-success', text: 'Diterima', icon: 'bi-check-circle' },
      'rejected': { class: 'bg-danger', text: 'Ditolak', icon: 'bi-x-circle' }
    };
    
    const config = statusConfig[status] || statusConfig['registered'];
    return (
      <span className={`badge ${config.class} text-white px-3 py-2`}>
        <i className={`bi ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <AdminNavbar />
          <div className="container-fluid">
            <div className="row">
              <AdminSidebar />
              <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Memuat detail aplikasi...</p>
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
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <i className="bi bi-exclamation-triangle text-danger" style={{fontSize: '3rem'}}></i>
                    <h4 className="mt-3 text-danger">Error</h4>
                    <p className="text-muted">{error}</p>
                    <button onClick={() => navigate('/admin/applications')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Aplikasi
                    </button>
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

  if (!application) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <AdminNavbar />
          <div className="container-fluid">
            <div className="row">
              <AdminSidebar />
              <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <i className="bi bi-file-earmark-x text-muted" style={{fontSize: '3rem'}}></i>
                    <h4 className="mt-3 text-muted">Aplikasi Tidak Ditemukan</h4>
                    <p className="text-muted">Data aplikasi yang Anda cari tidak ditemukan.</p>
                    <button onClick={() => navigate('/admin/applications')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Aplikasi
                    </button>
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
                      <li className="breadcrumb-item">
                        <Link to="/admin" className="text-decoration-none text-muted">
                          Dashboard
                        </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/admin/applications" className="text-decoration-none text-muted">
                          Aplikasi Magang
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Detail Aplikasi
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-file-earmark-text me-2"></i>Detail Aplikasi Magang
                  </h2>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/admin/applications" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Kembali
                  </Link>
                </div>
              </div>

              {/* Application Details */}
              <div className="row">
                <div className="col-lg-8">
                  {/* Application Info */}
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-file-earmark-text me-2"></i>Informasi Aplikasi
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-hash text-primary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">ID Aplikasi</small>
                              <span className="fw-semibold">{application.id}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-calendar-check text-primary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Tanggal Apply</small>
                              <span className="fw-semibold">{formatDate(application.apply_date)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-shield-check text-primary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Status</small>
                              <span className="fw-semibold">{getStatusBadge(application.status)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-clock text-primary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Dibuat Pada</small>
                              <span className="fw-semibold">{formatDate(application.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Information */}
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-person me-2"></i>Informasi Siswa
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-person-badge text-info"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Nama Siswa</small>
                              <span className="fw-semibold">{application.student_name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-card-text text-info"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">NIS</small>
                              <span className="fw-semibold">{application.student_nis}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-hash text-info"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">ID Siswa</small>
                              <span className="fw-semibold">{application.id_student}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Program Information */}
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-briefcase me-2"></i>Informasi Program
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-briefcase text-success"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Judul Program</small>
                              <span className="fw-semibold">{application.program_title}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-building text-success"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Perusahaan</small>
                              <span className="fw-semibold">{application.company_name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-hash text-success"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">ID Program</small>
                              <span className="fw-semibold">{application.id_program}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-warning text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-file-earmark me-2"></i>Dokumen Aplikasi
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-file-earmark-text text-warning"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">CV</small>
                              <a href={application.cv_url} target="_blank" rel="noopener noreferrer" className="fw-semibold text-decoration-none">
                                Lihat CV
                                <i className="bi bi-box-arrow-up-right ms-1"></i>
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-file-earmark-text text-warning"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Surat Rekomendasi</small>
                              <a href={application.recommendation_letter_url} target="_blank" rel="noopener noreferrer" className="fw-semibold text-decoration-none">
                                Lihat Surat
                                <i className="bi bi-box-arrow-up-right ms-1"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  {application.feedback && (
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-secondary text-white">
                        <h5 className="mb-0">
                          <i className="bi bi-chat-quote me-2"></i>Feedback
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="bg-light rounded p-3">
                          <p className="mb-0">{application.feedback}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-lg-4">
                  {/* System Info */}
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-secondary text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-info-circle me-2"></i>Informasi Sistem
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-hash text-secondary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">ID Aplikasi</small>
                              <span className="fw-semibold">#{application.id}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-calendar-plus text-secondary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Dibuat Pada</small>
                              <span className="fw-semibold">
                                {application.created_at ? new Date(application.created_at).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '-'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-calendar-check text-secondary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Terakhir Diperbarui</small>
                              <span className="fw-semibold">
                                {application.updated_at ? new Date(application.updated_at).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default ApplicationDetailPage;
