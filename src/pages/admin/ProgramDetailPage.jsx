import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getProgramById } from '../../apis/adminApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import '../../styles/Admin.css';

const ProgramDetailPage = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        setLoading(true);
        const response = await getProgramById(programId);
        setProgram(response.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat detail program');
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgramDetail();
    }
  }, [programId]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { class: 'bg-success', text: 'Terbuka', icon: 'bi-check-circle' },
      'closed': { class: 'bg-danger', text: 'Ditutup', icon: 'bi-x-circle' },
      'draft': { class: 'bg-warning', text: 'Draft', icon: 'bi-pencil' }
    };
    
    const config = statusConfig[status] || statusConfig['draft'];
    return (
      <span className={`badge ${config.class} text-white px-3 py-2`}>
        <i className={`bi ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getInternTypeBadge = (type) => {
    const typeConfig = {
      'onsite': { class: 'bg-primary', text: 'Onsite', icon: 'bi-building' },
      'remote': { class: 'bg-info', text: 'Remote', icon: 'bi-laptop' },
      'hybrid': { class: 'bg-secondary', text: 'Hybrid', icon: 'bi-phone' }
    };
    
    const config = typeConfig[type] || typeConfig['onsite'];
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
                    <p className="text-muted">Memuat detail program...</p>
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
                    <button onClick={() => navigate('/admin/programs')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Program
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

  if (!program) {
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
                    <h4 className="mt-3 text-muted">Program Tidak Ditemukan</h4>
                    <p className="text-muted">Data program yang Anda cari tidak ditemukan.</p>
                    <button onClick={() => navigate('/admin/programs')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Program
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
                        <Link to="/admin/programs" className="text-decoration-none text-muted">
                          Program Magang
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Detail Program
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-briefcase me-2"></i>Detail Program Magang
                  </h2>
                </div>
                <div className="d-flex gap-2">
                  {getStatusBadge(program.status)}
                  {getInternTypeBadge(program.intern_type)}
                </div>
              </div>

              {/* Main Content */}
              <div className="card shadow-sm border-0 program-detail-card">
                <div className="card-body p-4">
                  {/* Company Info */}
                  <div className="d-flex align-items-center mb-4">
                    <img 
                      src={program.photo || 'https://via.placeholder.com/60x60?text=Logo'} 
                      alt={`Logo ${program.company_name}`} 
                      className="rounded me-3"
                      style={{
                        height: '60px',
                        width: '60px',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <h6 className="text-muted mb-0">{program.company_name}</h6>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        Dibuat {formatDate(program.created_at)}
                      </small>
                    </div>
                  </div>

                  {/* Program Title */}
                  <h2 className="fw-bold text-primary mb-3">{program.title}</h2>

                  {/* Key Info Grid */}
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="bg-light rounded p-3 text-center info-grid-item">
                        <i className="bi bi-geo-alt text-primary fs-4"></i>
                        <div className="fw-semibold mt-2">{program.location}</div>
                        <small className="text-muted">Lokasi</small>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="bg-light rounded p-3 text-center info-grid-item">
                        <i className="bi bi-calendar text-info fs-4"></i>
                        <div className="fw-semibold mt-2">{program.duration}</div>
                        <small className="text-muted">Durasi</small>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="bg-light rounded p-3 text-center info-grid-item">
                        <i className="bi bi-people text-success fs-4"></i>
                        <div className="fw-semibold mt-2">{program.quota} Posisi</div>
                        <small className="text-muted">Quota</small>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="bg-light rounded p-3 text-center info-grid-item">
                        <i className="bi bi-person-badge text-warning fs-4"></i>
                        <div className="fw-semibold mt-2">{program.mentor_name}</div>
                        <small className="text-muted">Mentor</small>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <h5 className="fw-semibold mb-3">
                      <i className="bi bi-file-text text-primary me-2"></i>
                      Deskripsi Program
                    </h5>
                    <div className="bg-light rounded p-3">
                      <p className="mb-0">{program.description}</p>
                    </div>
                  </div>

                  {/* Two Column Layout for Details */}
                  <div className="row g-4">
                    {/* Left Column */}
                    <div className="col-12 col-lg-6">
                      {/* Qualifications */}
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-primary text-white">
                          <h6 className="mb-0">
                            <i className="bi bi-list-check me-2"></i>
                            Kualifikasi
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="bg-light rounded p-3">
                            <p className="mb-0">{program.qualification}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-12 col-lg-6">
                      {/* Benefits */}
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-success text-white">
                          <h6 className="mb-0">
                            <i className="bi bi-gift me-2"></i>
                            Benefit
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="bg-light rounded p-3">
                            <p className="mb-0">{program.benefits}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-4">
                    <h5 className="fw-semibold mb-3">
                      <i className="bi bi-calendar-event text-primary me-2"></i>
                      Timeline Program
                    </h5>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <div className="bg-light rounded p-3 timeline-item">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style={{width: '40px', height: '40px'}}>
                              <i className="bi bi-play-fill text-white"></i>
                            </div>
                            <div>
                              <div className="fw-semibold">Tanggal Mulai</div>
                              <div className="text-muted">{formatDate(program.start_date)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="bg-light rounded p-3 timeline-item">
                          <div className="d-flex align-items-center">
                            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style={{width: '40px', height: '40px'}}>
                              <i className="bi bi-check-lg text-white"></i>
                            </div>
                            <div>
                              <div className="fw-semibold">Tanggal Selesai</div>
                              <div className="text-muted">{formatDate(program.end_date)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="mt-4">
                    <h5 className="fw-semibold mb-3">
                      <i className="bi bi-info-circle text-primary me-2"></i>
                      Informasi Sistem
                    </h5>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <div className="bg-light rounded p-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-hash text-secondary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">ID Program</small>
                              <span className="fw-semibold">#{program.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="bg-light rounded p-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-tags text-secondary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Kategori</small>
                              <span className="badge bg-info">{program.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-top">
                    <div className="d-flex flex-column flex-md-row gap-2 justify-content-center action-buttons">
                      <Link to="/admin/programs" className="btn btn-outline-secondary btn-lg px-4">
                        <i className="bi bi-arrow-left me-2"></i>
                        Kembali ke Daftar Program
                      </Link>
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

export default ProgramDetailPage;
