import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getStudentById } from '../../apis/adminApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import '../../styles/Admin.css';

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getStudentById(id);
        setStudent(response.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat data siswa');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
                    <p className="text-muted">Memuat data siswa...</p>
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
                    <button onClick={() => navigate('/admin/students')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Siswa
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

  if (!student) {
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
                    <h4 className="mt-3 text-muted">Siswa Tidak Ditemukan</h4>
                    <p className="text-muted">Data siswa yang Anda cari tidak ditemukan.</p>
                    <button onClick={() => navigate('/admin/students')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Siswa
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
                        <Link to="/admin/students" className="text-decoration-none text-muted">
                          Siswa
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Detail Siswa
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-person me-2"></i>Detail Siswa
                  </h2>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/admin/students" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Kembali
                  </Link>
                  <Link to={`/admin/students/edit/${student.id}`} className="btn btn-primary">
                    <i className="bi bi-pencil me-2"></i>Edit Siswa
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
                          src={student.photo || 'https://via.placeholder.com/150x150'} 
                          alt="Student" 
                          className="rounded-circle shadow-sm"
                          style={{width: '120px', height: '120px', objectFit: 'cover'}}
                        />
                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2" style={{width: '35px', height: '35px'}}>
                          <i className="bi bi-check-circle-fill text-white"></i>
                        </div>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">{student.full_name}</h4>
                      <p className="text-muted mb-3">
                        <i className={`bi ${getGenderIcon(student.gender)} ${getGenderColor(student.gender)} me-2`}></i>
                        {student.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                      </p>
                      <div className="d-grid gap-2">
                        <span className="badge bg-primary-subtle text-primary fs-6 py-2">
                          <i className="bi bi-person-badge me-2"></i>
                          {student.nis}
                        </span>
                        <span className="badge bg-info-subtle text-info fs-6 py-2">
                          <i className="bi bi-mortarboard me-2"></i>
                          {student.class}
                        </span>
                        <span className="badge bg-success-subtle text-success fs-6 py-2">
                          <i className="bi bi-book me-2"></i>
                          {student.major}
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
                              <span className="fw-semibold">{student.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-telephone text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">No. Telepon</small>
                              <span className="fw-semibold">{formatPhoneNumber(student.phone_number)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-event text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Tanggal Lahir</small>
                              <span className="fw-semibold">{formatDate(student.birth_date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-start p-3 bg-light rounded-3">
                            <i className="bi bi-geo-alt text-primary me-3 fs-5 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Alamat</small>
                              <span className="fw-semibold">{student.address || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0 pb-0">
                      <h5 className="fw-bold text-primary mb-0">
                        <i className="bi bi-mortarboard me-2"></i>
                        Informasi Akademik
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-building text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Nama Sekolah</small>
                              <span className="fw-semibold">{student.school_name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-people text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Kelas</small>
                              <span className="fw-semibold">{student.class}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-book text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Jurusan</small>
                              <span className="fw-semibold">{student.major}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-start p-3 bg-light rounded-3">
                            <i className="bi bi-chat-quote text-primary me-3 fs-5 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Bio</small>
                              <span className="fw-semibold">{student.bio || 'Tidak ada bio'}</span>
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
                              <small className="text-muted d-block">ID Siswa</small>
                              <span className="fw-semibold">{student.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-shield-check text-success fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Role</small>
                              <span className="fw-semibold text-capitalize">{student.role}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-plus text-info fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Dibuat Pada</small>
                              <span className="fw-semibold">{formatDate(student.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-check text-warning fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Diperbarui Pada</small>
                              <span className="fw-semibold">{formatDate(student.updated_at)}</span>
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

export default StudentDetailPage;
