import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyFooter from '../../components/company/CompanyFooter';
import { getProfile, updateCompanyProfile, updatePassword } from '../../apis/authApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';

const CompanyProfile = () => {
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
        // Fallback jika struktur data berbeda
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
      company_name: profile.company_name || profile.full_name || '',
      company_address: profile.company_address || '',
      company_phone: profile.company_phone || profile.phone_number || '',
      company_email: profile.company_email || profile.email || '',
      company_website: profile.company_website || '',
      company_logo: profile.company_logo || profile.photo || '',
      company_description: profile.company_description || ''
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
      const res = await updateCompanyProfile({
        company_name: form.company_name,
        company_address: form.company_address,
        company_phone: form.company_phone,
        company_email: form.company_email,
        company_website: form.company_website,
        company_logo: form.company_logo,
        company_description: form.company_description,
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

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <CompanyNavbar />
        <div className="container-fluid">
          <div className="row">
            <CompanySidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '65px', marginBottom: '100px'}}>
              <div className="mb-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item">
                      <Link to="/company" className="text-decoration-none text-muted">
                        Dashboard
                      </Link>
                    </li>
                    <li className="breadcrumb-item active text-primary">
                      Profil Perusahaan
                    </li>
                  </ol>
                </nav>
              </div>
              {loading ? (
                <div className="text-center py-5">Memuat data profil...</div>
              ) : error ? (
                <div className="alert alert-danger my-4 text-center">{error}</div>
              ) : profile ? (
                <div className="profile-section mt-3">
                  <img src={profile.company_logo || profile.photo || 'https://via.placeholder.com/100x100?text=Logo'} alt="Logo Company" className="profile-photo" />
                  <div className="mb-2">
                    <span className="badge bg-primary-subtle text-primary profile-badge">{profile.role}</span>
                  </div>
                  <h4 className="fw-bold mb-1">{profile.company_name || profile.full_name}</h4>
                  <div className="mb-2 text-muted">{profile.company_email || profile.email}</div>
                  <div className="mb-2 text-muted">
                    <i className="bi bi-telephone me-1"></i>{profile.company_phone || profile.phone_number}
                  </div>
                  {profile.company_address && (
                    <div className="mb-2 text-muted">
                      <i className="bi bi-geo-alt me-1"></i>{profile.company_address}
                    </div>
                  )}
                  {profile.company_website && (
                    <div className="mb-2 text-muted">
                      <i className="bi bi-globe me-1"></i>
                      <a href={profile.company_website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        {profile.company_website}
                      </a>
                    </div>
                  )}
                  {profile.company_description && (
                    <div className="mb-3">
                      <p className="text-muted small">{profile.company_description}</p>
                    </div>
                  )}
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
                        <h5 className="modal-title">Edit Profile Company</h5>
                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                          <div className="mb-3 text-center">
                            <img src={form.company_logo || 'https://via.placeholder.com/100x100?text=Logo'} alt="Logo Company" className="profile-photo mb-2" />
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-bold">Nama Perusahaan *</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="company_name" 
                                  value={form.company_name} 
                                  onChange={handleChange} 
                                  required 
                                  placeholder="Contoh: PT. Test Solutions"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-bold">Email Perusahaan *</label>
                                <input 
                                  type="email" 
                                  className="form-control" 
                                  name="company_email" 
                                  value={form.company_email} 
                                  onChange={handleChange} 
                                  required 
                                  placeholder="info@company.com"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-bold">Nomor Telepon *</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  name="company_phone" 
                                  value={form.company_phone} 
                                  onChange={handleChange} 
                                  required 
                                  placeholder="0211234567"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Website</label>
                                <input 
                                  type="url" 
                                  className="form-control" 
                                  name="company_website" 
                                  value={form.company_website} 
                                  onChange={handleChange} 
                                  placeholder="https://example.com"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label fw-bold">Alamat Perusahaan *</label>
                            <textarea 
                              className="form-control" 
                              name="company_address" 
                              value={form.company_address} 
                              onChange={handleChange} 
                              rows="2" 
                              required
                              placeholder="Jl. Industri No. 1, Jakarta, Indonesia"
                            ></textarea>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Deskripsi Perusahaan</label>
                            <textarea 
                              className="form-control" 
                              name="company_description" 
                              value={form.company_description} 
                              onChange={handleChange} 
                              rows="4" 
                              placeholder="Deskripsi singkat tentang perusahaan, visi, misi, dan bidang usaha..."
                            ></textarea>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Logo Perusahaan (URL)</label>
                            <input 
                              type="url" 
                              className="form-control" 
                              name="company_logo" 
                              value={form.company_logo} 
                              onChange={handleChange} 
                              placeholder="https://example.com/logo.png"
                            />
                            <div className="form-text">
                              Masukkan URL gambar logo perusahaan Anda
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
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
        <CompanyFooter />
      </div>
    </SidebarProvider>
  );
};

export default CompanyProfile;
