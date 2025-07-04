import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getProfile, updateProfile, updatePassword } from '../../apis/authApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import { Link } from 'react-router-dom';

const AdminProfile = () => {
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
    setForm(profile);
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
        phone_number: form.phone_number,
        photo: form.photo,
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
                      <li className="breadcrumb-item active text-primary">
                        Profil Admin
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-person-circle me-2"></i>Profil Admin
                  </h2>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">Memuat data profil...</div>
              ) : error ? (
                <div className="alert alert-danger my-4 text-center">{error}</div>
              ) : profile ? (
                <div className="profile-section mt-3">
                  <img src={profile.photo || 'https://example.com/photo.jpg'} alt="Foto Admin" className="profile-photo" />
                  <div className="mb-2">
                    <span className="badge bg-primary-subtle text-primary profile-badge">{profile.role}</span>
                  </div>
                  <h4 className="fw-bold mb-1">{profile.full_name}</h4>
                  <div className="mb-2 text-muted">{profile.email}</div>
                  <div className="mb-3 text-muted"><i className="bi bi-telephone me-1"></i>{profile.phone_number}</div>
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
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Profile</h5>
                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                          <div className="mb-3 text-center">
                            <img src={form.photo || 'https://example.com/photo.jpg'} alt="Foto Admin" className="profile-photo mb-2" />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Nama Lengkap</label>
                            <input type="text" className="form-control" name="full_name" value={form.full_name || ''} onChange={handleChange} required />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" value={form.email || ''} onChange={handleChange} required />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">No. HP</label>
                            <input type="text" className="form-control" name="phone_number" value={form.phone_number || ''} onChange={handleChange} required />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Foto (URL)</label>
                            <input type="text" className="form-control" name="photo" value={form.photo || ''} onChange={handleChange} />
                          </div>
                          {modalError && <div className="alert alert-danger my-3">{modalError}</div>}
                          {modalSuccess && <div className="alert alert-success my-3">{modalSuccess}</div>}
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Batal</button>
                          <button type="submit" className="btn btn-primary">Simpan</button>
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
                            <label className="form-label">Password Sekarang</label>
                            <input type="password" className="form-control" name="current_password" value={passwordForm.current_password} onChange={handlePasswordChange} required />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Password Baru</label>
                            <input type="password" className="form-control" name="new_password" value={passwordForm.new_password} onChange={handlePasswordChange} required />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Konfirmasi Password</label>
                            <input type="password" className="form-control" name="confirm_password" value={passwordForm.confirm_password} onChange={handlePasswordChange} required />
                          </div>
                          {passwordError && <div className="alert alert-danger my-3">{passwordError}</div>}
                          {passwordSuccess && <div className="alert alert-success my-3">{passwordSuccess}</div>}
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={handleClosePasswordModal}>Batal</button>
                          <button type="submit" className="btn btn-primary">Simpan</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
        <AdminFooter />
      </div>
    </SidebarProvider>
  );
};

export default AdminProfile;
