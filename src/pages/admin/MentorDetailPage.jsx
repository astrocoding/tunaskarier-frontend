import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getMentorById } from '../../apis/adminApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import '../../styles/Admin.css';

const MentorDetailPage = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const response = await getMentorById(mentorId);
        setMentor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil data mentor');
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    return phone.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const getGenderIcon = (gender) => {
    return gender === 'male' ? 'bi-gender-male' : 'bi-gender-female';
  };

  const getGenderColor = (gender) => {
    return gender === 'male' ? 'text-primary' : 'text-pink';
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
                    <p className="text-muted">Memuat data mentor...</p>
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
                    <button onClick={() => navigate('/admin/mentors')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Mentor
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

  if (!mentor) {
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
                    <i className="bi bi-person-x text-muted" style={{fontSize: '3rem'}}></i>
                    <h4 className="mt-3 text-muted">Mentor Tidak Ditemukan</h4>
                    <p className="text-muted">Data mentor yang Anda cari tidak ditemukan.</p>
                    <button onClick={() => navigate('/admin/mentors')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Mentor
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
              {/* Header Section */}
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
                        <Link to="/admin/mentors" className="text-decoration-none text-muted">
                          Mentor
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Detail Mentor
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-person-badge me-2"></i>Detail Mentor
                  </h2>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/admin/mentors" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Kembali
                  </Link>
                  <Link to={`/admin/mentors/edit/${mentor.mentor_id}`} className="btn btn-primary">
                    <i className="bi bi-pencil me-2"></i>Edit Mentor
                  </Link>
                </div>
              </div>

              {/* Main Content */}
              <div className="row g-4">
                {/* Profile Card */}
                <div className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-4">
                      <div className="position-relative d-inline-block mb-4">
                        <img 
                          src={mentor.photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} 
                          alt="Mentor" 
                          className="rounded-circle shadow-sm"
                          style={{width: '120px', height: '120px', objectFit: 'cover'}}
                        />
                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2" style={{width: '35px', height: '35px'}}>
                          <i className="bi bi-check-circle-fill text-white"></i>
                        </div>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">{mentor.full_name}</h4>
                      <p className="text-muted mb-3">
                        <i className={`bi ${getGenderIcon(mentor.gender)} ${getGenderColor(mentor.gender)} me-2`}></i>
                        {mentor.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                      </p>
                      <div className="d-grid gap-2">
                        <span className="badge bg-primary-subtle text-primary fs-6 py-2">
                          <i className="bi bi-briefcase me-2"></i>
                          {mentor.position}
                        </span>
                        <span className="badge bg-info-subtle text-info fs-6 py-2">
                          <i className="bi bi-building me-2"></i>
                          {mentor.department}
                        </span>
                        <span className="badge bg-success-subtle text-success fs-6 py-2">
                          <i className="bi bi-shield-check me-2"></i>
                          {mentor.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0 pb-0">
                      <h5 className="fw-bold text-primary mb-0">
                        <i className="bi bi-person-circle me-2"></i>
                        Informasi Pribadi
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-envelope text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Email</small>
                              <span className="fw-semibold">{mentor.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-telephone text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">No. Telepon</small>
                              <span className="fw-semibold">{formatPhoneNumber(mentor.phone_number)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-briefcase text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Posisi</small>
                              <span className="fw-semibold">{mentor.position}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-building text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Departemen</small>
                              <span className="fw-semibold">{mentor.department}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0 pb-0">
                      <h5 className="fw-bold text-primary mb-0">
                        <i className="bi bi-briefcase me-2"></i>
                        Informasi Profesional
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-shield-check text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Role</small>
                              <span className="fw-semibold text-capitalize">{mentor.role}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-plus text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Bergabung Sejak</small>
                              <span className="fw-semibold">
                                {mentor.created_at ? new Date(mentor.created_at).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-check text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Terakhir Diperbarui</small>
                              <span className="fw-semibold">
                                {mentor.updated_at ? new Date(mentor.updated_at).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="fw-bold text-primary mb-0">
                        <i className="bi bi-gear me-2"></i>
                        Informasi Sistem
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-person-badge text-primary fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">ID Mentor</small>
                              <span className="fw-semibold">{mentor.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-shield-check text-success fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Role</small>
                              <span className="fw-semibold text-capitalize">{mentor.role}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-plus text-info fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Dibuat Pada</small>
                              <span className="fw-semibold">
                                {mentor.created_at ? new Date(mentor.created_at).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-check text-warning fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Diperbarui Pada</small>
                              <span className="fw-semibold">
                                {mentor.updated_at ? new Date(mentor.updated_at).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
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

export default MentorDetailPage;
