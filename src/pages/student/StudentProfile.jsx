import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentNavbar from '../../components/student/StudentNavbar';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentFooter from '../../components/student/StudentFooter';
import { getProfile, updateProfile } from '../../apis/authApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import '../../styles/Global.css';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    bio: '',
    photo: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getProfile();
        if (response.status === 'success') {
          setProfile(response.data);
        } else {
          setError('Gagal memuat data profil');
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat data profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  // Toast component
  const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';
    const icon = type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle';

    return (
      <div className={`toast show position-fixed top-0 end-0 m-3 ${bgColor} text-white`} 
        style={{ zIndex: 9999, minWidth: '300px' }}>
        <div className="toast-header bg-transparent text-white border-0">
          <i className={`bi ${icon} me-2`}></i>
          <strong className="me-auto">
            {type === 'success' ? 'Sukses' : 'Error'}
          </strong>
          <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    );
  };

  // Handle edit modal
  const handleOpenEditModal = () => {
    setEditForm({
      full_name: profile.full_name || '',
      phone_number: profile.phone_number || '',
      address: profile.address || '',
      bio: profile.bio || '',
      photo: profile.photo || ''
    });
    setShowEditModal(true);
    setToast({ show: false, message: '', type: '' });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditLoading(false);
    setToast({ show: false, message: '', type: '' });
  };

  const handleEditInput = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setToast({ show: false, message: '', type: '' });

    // Validation
    if (!editForm.full_name.trim()) {
      setToast({ show: true, message: 'Nama lengkap wajib diisi', type: 'error' });
      setEditLoading(false);
      return;
    }

    if (!editForm.phone_number.trim()) {
      setToast({ show: true, message: 'Nomor telepon wajib diisi', type: 'error' });
      setEditLoading(false);
      return;
    }

    try {
      const response = await updateProfile(editForm);
      
      if (response.status === 'success') {
        setToast({ show: true, message: 'Profil berhasil diperbarui!', type: 'success' });
        
        // Update local profile data
        setProfile(prev => ({
          ...prev,
          ...editForm
        }));

        setTimeout(() => {
          setShowEditModal(false);
          setToast({ show: false, message: '', type: '' });
        }, 1500);
      } else {
        setToast({ show: true, message: response.message || 'Gagal memperbarui profil', type: 'error' });
      }
    } catch (err) {
      setToast({ 
        show: true, 
        message: err.message || 'Gagal memperbarui profil', 
        type: 'error' 
      });
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <StudentNavbar />
          <div className="container-fluid">
            <div className="row">
              <StudentSidebar />
              <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Memuat data profil...</p>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <StudentFooter />
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <StudentNavbar />
          <div className="container-fluid">
            <div className="row">
              <StudentSidebar />
              <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <i className="bi bi-exclamation-triangle text-danger" style={{fontSize: '3rem'}}></i>
                    <h4 className="mt-3 text-danger">Error</h4>
                    <p className="text-muted">{error}</p>
                    <button onClick={() => navigate('/student')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Dashboard
                    </button>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <StudentFooter />
        </div>
      </SidebarProvider>
    );
  }

  if (!profile) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <StudentNavbar />
          <div className="container-fluid">
            <div className="row">
              <StudentSidebar />
              <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <i className="bi bi-person-x text-muted" style={{fontSize: '3rem'}}></i>
                    <h4 className="mt-3 text-muted">Profil Tidak Ditemukan</h4>
                    <p className="text-muted">Data profil Anda tidak ditemukan.</p>
                    <button onClick={() => navigate('/student')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Dashboard
                    </button>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <StudentFooter />
        </div>
      </SidebarProvider>
    );
  }

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
                      <li className="breadcrumb-item"><Link to="/student" className="text-decoration-none">Dashboard</Link></li>
                      <li className="breadcrumb-item active" aria-current="page">Profil Saya</li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">Profil Saya</h2>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/student" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Kembali
                  </Link>
                  <button onClick={handleOpenEditModal} className="btn btn-primary">
                    <i className="bi bi-pencil me-2"></i>Edit Profil
                  </button>
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
                          src={profile.photo || 'https://via.placeholder.com/150x150'} 
                          alt="Student Profile" 
                          className="rounded-circle shadow-sm"
                          style={{width: '120px', height: '120px', objectFit: 'cover'}}
                        />
                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2" style={{width: '35px', height: '35px'}}>
                          <i className="bi bi-check-circle-fill text-white"></i>
                        </div>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">{profile.full_name}</h4>
                      <p className="text-muted mb-3">
                        <i className={`bi ${getGenderIcon(profile.gender)} ${getGenderColor(profile.gender)} me-2`}></i>
                        {profile.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                      </p>
                      <div className="d-grid gap-2">
                        <span className="badge bg-primary-subtle text-primary fs-6 py-2">
                          <i className="bi bi-person-badge me-2"></i>
                          {profile.nis}
                        </span>
                        <span className="badge bg-info-subtle text-info fs-6 py-2">
                          <i className="bi bi-mortarboard me-2"></i>
                          {profile.class}
                        </span>
                        <span className="badge bg-success-subtle text-success fs-6 py-2">
                          <i className="bi bi-book me-2"></i>
                          {profile.major}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0 pb-0" style={{paddingTop: '1rem'}}>
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
                              <span className="fw-semibold">{profile.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-telephone text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">No. Telepon</small>
                              <span className="fw-semibold">{formatPhoneNumber(profile.phone_number)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-event text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Tanggal Lahir</small>
                              <span className="fw-semibold">{formatDate(profile.birth_date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-start p-3 bg-light rounded-3">
                            <i className="bi bi-geo-alt text-primary me-3 fs-5 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Alamat</small>
                              <span className="fw-semibold">{profile.address || '-'}</span>
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
                    <div className="card-header bg-transparent border-0 pb-0" style={{paddingTop: '1rem'}}>
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
                              <span className="fw-semibold">{profile.school_name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-people text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Kelas</small>
                              <span className="fw-semibold">{profile.class}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-book text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Jurusan</small>
                              <span className="fw-semibold">{profile.major}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-start p-3 bg-light rounded-3">
                            <i className="bi bi-chat-quote text-primary me-3 fs-5 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Bio</small>
                              <span className="fw-semibold">{profile.bio || 'Tidak ada bio'}</span>
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
                    <div className="card-header bg-transparent border-0" style={{paddingTop: '1rem'}}>
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
                              <small className="text-muted d-block">ID User</small>
                              <span className="fw-semibold">{profile.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-person-vcard text-info fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">ID Siswa</small>
                              <span className="fw-semibold">{profile.student_id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-plus text-success fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Dibuat Pada</small>
                              <span className="fw-semibold">{formatDate(profile.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-check text-warning fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Diperbarui Pada</small>
                              <span className="fw-semibold">{formatDate(profile.updated_at)}</span>
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
        <StudentFooter />

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Profil
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseEditModal}
                  ></button>
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      {/* Full Name */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-person me-2 text-primary"></i>
                          Nama Lengkap <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={editForm.full_name}
                          onChange={handleEditInput}
                          className="form-control"
                          placeholder="Masukkan nama lengkap"
                          required
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-telephone me-2 text-primary"></i>
                          Nomor Telepon <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={editForm.phone_number}
                          onChange={handleEditInput}
                          className="form-control"
                          placeholder="Contoh: 081234567890"
                          required
                        />
                      </div>

                      {/* Address */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-geo-alt me-2 text-primary"></i>
                          Alamat
                        </label>
                        <textarea
                          name="address"
                          value={editForm.address}
                          onChange={handleEditInput}
                          className="form-control"
                          rows="3"
                          placeholder="Masukkan alamat lengkap"
                        />
                      </div>

                      {/* Bio */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-chat-quote me-2 text-primary"></i>
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={editForm.bio}
                          onChange={handleEditInput}
                          className="form-control"
                          rows="3"
                          placeholder="Ceritakan sedikit tentang diri Anda..."
                        />
                      </div>

                      {/* Photo URL */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-image me-2 text-primary"></i>
                          URL Foto Profil
                        </label>
                        <input
                          type="url"
                          name="photo"
                          value={editForm.photo}
                          onChange={handleEditInput}
                          className="form-control"
                          placeholder="https://example.com/photo.jpg"
                        />
                        <small className="text-muted">
                          Masukkan URL gambar untuk foto profil Anda
                        </small>
                      </div>
                    </div>

                    {/* Toast Notification */}
                    {toast.show && (
                      <div className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} mt-3`} role="alert">
                        <i className={`bi ${toast.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
                        {toast.message}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer border-0 pt-0">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={handleCloseEditModal}
                      disabled={editLoading}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={editLoading}
                      style={{ minWidth: '140px' }}
                    >
                      {editLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" style={{ width: '0.8rem', height: '0.8rem' }} role="status"></span>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Backdrop */}
        {showEditModal && (
          <div className="modal-backdrop fade show"></div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: '' })}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default StudentProfile;
