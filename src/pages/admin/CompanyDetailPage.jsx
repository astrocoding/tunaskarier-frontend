import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getCompanyById } from '../../apis/adminApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';
import '../../styles/Admin.css';

const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await getCompanyById(id);
        setCompany(response.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat data perusahaan');
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: err.message || 'Gagal memuat data perusahaan',
          confirmButtonText: 'OK'
        }).then(() => navigate('/admin/companies'));
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, navigate]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    return phone.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
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
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
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
                <div className="text-center text-danger">
                  <i className="bi bi-exclamation-triangle display-1"></i>
                  <h3>Error</h3>
                  <p>{error}</p>
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
                        <Link to="/admin/companies" className="text-decoration-none text-muted">
                          Perusahaan
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Detail Perusahaan
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-building me-2"></i>Detail Perusahaan
                  </h2>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/admin/companies/edit/${id}`} className="btn btn-primary">
                    <i className="bi bi-pencil me-2"></i>Edit
                  </Link>
                  <Link to="/admin/companies" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Kembali
                  </Link>
                </div>
              </div>

              {/* Company Details */}
              <div className="row">
                <div className="col-lg-8">
                  {/* Profile Card */}
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-building me-2"></i>Informasi Perusahaan
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row align-items-center mb-4">
                        <div className="col-auto">
                          <img 
                            src={company.company_logo || 'https://via.placeholder.com/100x100'} 
                            alt="Company Logo" 
                            className="rounded-circle"
                            style={{width: '100px', height: '100px', objectFit: 'cover'}}
                          />
                        </div>
                        <div className="col">
                          <h3 className="fw-bold mb-1">{company.company_name || 'Nama Perusahaan Tidak Tersedia'}</h3>
                          <p className="text-muted mb-2">
                            <i className="bi bi-geo-alt me-1"></i>
                            {company.company_address || 'Alamat tidak tersedia'}
                          </p>
                          {company.company_description && (
                            <p className="text-muted mb-0">{company.company_description}</p>
                          )}
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-envelope text-primary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Email</small>
                              <span className="fw-semibold">{company.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-telephone text-primary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Nomor Telepon</small>
                              <span className="fw-semibold">{formatPhoneNumber(company.company_phone)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-envelope text-primary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Email Perusahaan</small>
                              <span className="fw-semibold">{company.company_email || '-'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-link-45deg text-primary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Website</small>
                              {company.company_website ? (
                                <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="fw-semibold text-decoration-none">
                                  Kunjungi Website
                                </a>
                              ) : (
                                <span className="fw-semibold text-muted">-</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Description */}
                  {company.company_description && (
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-header bg-info text-white">
                        <h5 className="mb-0">
                          <i className="bi bi-chat-quote me-2"></i>Deskripsi Perusahaan
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <p className="mb-0">{company.company_description}</p>
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
                              <i className="bi bi-person-badge text-secondary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">ID Perusahaan</small>
                              <span className="fw-semibold">#{company.company_id}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-shield-check text-secondary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Role</small>
                              <span className="badge bg-primary">{company.role}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="bi bi-calendar text-secondary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Dibuat Pada</small>
                              <span className="fw-semibold">
                                {company.created_at ? new Date(company.created_at).toLocaleDateString('id-ID', {
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
                              <i className="bi bi-arrow-clockwise text-secondary"></i>
                            </div>
                            <div>
                              <small className="text-muted d-block">Terakhir Diperbarui</small>
                              <span className="fw-semibold">
                                {company.updated_at ? new Date(company.updated_at).toLocaleDateString('id-ID', {
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

export default CompanyDetailPage;
