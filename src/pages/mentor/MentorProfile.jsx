import React, { useState, useEffect } from 'react';
import MentorNavbar from '../../components/mentor/MentorNavbar';
import MentorSidebar from '../../components/mentor/MentorSidebar';
import MentorFooter from '../../components/mentor/MentorFooter';
import { getProfile, updateProfile, updatePassword } from '../../apis/authApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';

const MentorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getProfile();
        let data = res?.data?.data || res?.data || res;
        if (!data || !data.email) {
          setError('Data profil tidak ditemukan atau struktur API salah.');
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat profil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleOpenModal = () => {
    setForm({
      full_name: profile.full_name || '',
      position: profile.position || '',
      gender: profile.gender || 'male',
      phone_number: profile.phone_number || '',
      department: profile.department || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    try {
      const res = await updateProfile({
        full_name: form.full_name,
        position: form.position,
        gender: form.gender,
        phone_number: form.phone_number,
        department: form.department
      });
      setProfile((prev) => ({ ...prev, ...res.data }));
      setModalSuccess(res.message || 'Profil berhasil diupdate!');
      setTimeout(() => {
        setShowModal(false);
        setModalSuccess('');
      }, 1000);
    } catch (err) {
      setModalError(err.message || 'Gagal update profil');
    }
  };

  const handleOpenPasswordModal = () => {
    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => setShowPasswordModal(false);

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      setPasswordError('Semua field wajib diisi');
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Password baru dan konfirmasi tidak sama');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordError('Password baru minimal 6 karakter');
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await updatePassword(passwordForm);
      setPasswordSuccess(res.message || 'Password berhasil diubah!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 1200);
    } catch (err) {
      setPasswordError(err.message || 'Gagal mengubah password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getGenderText = (gender) => {
    return gender === 'male' ? 'Laki-laki' : 'Perempuan';
  };

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <MentorNavbar />
        <div className="container-fluid">
          <div className="row">
            <MentorSidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '65px', marginBottom: '100px'}}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item"><a href="/mentor" className="text-decoration-none">Dashboard</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Profil Saya</li>
                </ol>
              </nav>
              {loading ? (
                <div className="text-center py-5">Memuat data profil...</div>
              ) : error ? (
                <div className="alert alert-danger my-4 text-center">{error}</div>
              ) : profile ? (
                <div className="profile-section mt-3">
                  <img src={profile.photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="Foto Mentor" className="profile-photo" />
                  <div className="mb-2">
                    <span className="badge bg-primary-subtle text-primary profile-badge">{profile.role}</span>
                  </div>
                  <h4 className="fw-bold mb-1">{profile.full_name}</h4>
                  <div className="mb-2 text-muted">{profile.email}</div>
                  <div className="mb-2 text-muted">
                    <i className="bi bi-briefcase me-1"></i>{profile.position}
                  </div>
                  <div className="mb-2 text-muted">
                    <i className="bi bi-building me-1"></i>{profile.company_name}
                  </div>
                  <div className="mb-2 text-muted">
                    <i className="bi bi-diagram-3 me-1"></i>{profile.department}
                  </div>
                  <div className="mb-2 text-muted">
                    <i className="bi bi-gender-ambiguous me-1"></i>{getGenderText(profile.gender)}
                  </div>
                  <div className="mb-2 text-muted">
                    <i className="bi bi-telephone me-1"></i>{profile.phone_number}
                  </div>
                  <div className="mb-3 text-muted small">
                    <i className="bi bi-calendar me-1"></i>
                    Bergabung sejak {new Date(profile.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <button className="btn btn-outline-primary px-4 me-2" onClick={handleOpenModal}>
                    <i className="bi bi-pencil me-1"></i>Edit Profile
                  </button>
                  <button className="btn btn-outline-secondary px-4 mt-2 mt-md-0" onClick={handleOpenPasswordModal}>
                    <i className="bi bi-key me-1"></i>Ubah Password
                  </button>
                </div>
              ) : (
                <div className="alert alert-warning my-4 text-center">Data profil tidak ditemukan.</div>
              )}

              {/* Modal Edit Profile */}
              {showModal && form && (
                <div className="modal fade show" tabIndex="-1" style={{display:'block', background:'rgba(0,0,0,0.25)'}}>
                  <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Profile Mentor</h5>
                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                          <div className="mb-3 text-center">
                            <img src={profile.photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="Foto Mentor" className="profile-photo mb-2" />
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-bold">Nama Lengkap <span className="text-danger">*</span></label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="full_name" 
                                  value={form.full_name} 
                                  onChange={handleChange} 
                                  required 
                                  placeholder="Contoh: John Doe"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-bold">Posisi <span className="text-danger">*</span></label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="position" 
                                  value={form.position} 
                                  onChange={handleChange} 
                                  required 
                                  placeholder="Contoh: Senior Developer"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-bold">Department <span className="text-danger">*</span></label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="department" 
                                  value={form.department} 
                                  onChange={handleChange} 
                                  required 
                                  placeholder="Contoh: IT"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-bold">Gender <span className="text-danger">*</span></label>
                                <select 
                                  className="form-select" 
                                  name="gender" 
                                  value={form.gender} 
                                  onChange={handleChange} 
                                  required
                                >
                                  <option value="male">Laki-laki</option>
                                  <option value="female">Perempuan</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-bold">Nomor Telepon <span className="text-danger">*</span></label>
                                <input 
                                  type="tel" 
                                  className="form-control" 
                                  name="phone_number" 
                                  value={form.phone_number} 
                                  onChange={handleChange} 
                                  required 
                                  placeholder="08123456789"
                                />
                              </div>
                            </div>
                          </div>
                          {modalError && <div className="alert alert-danger my-3">{modalError}</div>}
                          {modalSuccess && <div className="alert alert-success my-3">{modalSuccess}</div>}
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Batal</button>
                          <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Ubah Password */}
              {showPasswordModal && (
                <div className="modal fade show" tabIndex="-1" style={{display:'block', background:'rgba(0,0,0,0.25)'}}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Ubah Password</h5>
                        <button type="button" className="btn-close" onClick={handleClosePasswordModal}></button>
                      </div>
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="modal-body">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Password Sekarang *</label>
                            <input 
                              type="password" 
                              className="form-control" 
                              name="current_password" 
                              value={passwordForm.current_password} 
                              onChange={handlePasswordChange} 
                              required 
                              placeholder="Masukkan password saat ini"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label fw-bold">Password Baru *</label>
                            <input 
                              type="password" 
                              className="form-control" 
                              name="new_password" 
                              value={passwordForm.new_password} 
                              onChange={handlePasswordChange} 
                              required 
                              placeholder="Minimal 6 karakter"
                            />
                            <div className="form-text">
                              Password baru minimal 6 karakter
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label fw-bold">Konfirmasi Password Baru *</label>
                            <input 
                              type="password" 
                              className="form-control" 
                              name="confirm_password" 
                              value={passwordForm.confirm_password} 
                              onChange={handlePasswordChange} 
                              required 
                              placeholder="Ulangi password baru"
                            />
                          </div>
                          {passwordError && <div className="alert alert-danger my-3">{passwordError}</div>}
                          {passwordSuccess && <div className="alert alert-success my-3">{passwordSuccess}</div>}
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={handleClosePasswordModal}>Batal</button>
                          <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                            {passwordLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" style={{width: '1rem', height: '1rem'}} role="status" aria-hidden="true"></span>
                                Menyimpan...
                              </>
                            ) : (
                              'Simpan Password'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
        <MentorFooter />
      </div>
    </SidebarProvider>
  );
};

export default MentorProfile;
