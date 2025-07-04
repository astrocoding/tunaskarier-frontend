import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { updateAdmin, getAdminById } from '../../apis/adminApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';

const AdminUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    photo: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch admin data by ID
  useEffect(() => {
    const fetchAdmin = async () => {
      setFetching(true);
      try {
        const res = await getAdminById(id);
        setFormData({
          email: res.data.email || '',
          password: '',
          full_name: res.data.full_name || '',
          phone_number: res.data.phone_number || '',
          photo: res.data.photo || '',
        });
      } catch (error) {
        console.error('Error fetching admin:', error);
        let errorMessage = 'Gagal mengambil data admin';
        
        if (error.message && error.message !== 'Data tidak valid') {
          errorMessage = error.message;
        } else if (error.data && error.data.message && error.data.message !== 'Data tidak valid') {
          errorMessage = error.data.message;
        } else if (error.response && error.response.data && error.response.data.message && error.response.data.message !== 'Data tidak valid') {
          errorMessage = error.response.data.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMessage,
          confirmButtonText: 'OK'
        }).then(() => navigate('/admin/admins'));
      } finally {
        setFetching(false);
      }
    };
    fetchAdmin();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (!formData.full_name.trim()) newErrors.full_name = 'Nama lengkap wajib diisi';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Nomor telepon wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Hanya kirim field yang diisi (password optional)
      const adminData = {
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        phone_number: formData.phone_number.trim(),
      };
      
      if (formData.password) {
        adminData.password = formData.password;
      }

      // Only add photo if it's not empty
      if (formData.photo.trim()) {
        adminData.photo = formData.photo.trim();
      }

      await updateAdmin(id, adminData);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data admin berhasil diperbarui',
        timer: 2000,
        showConfirmButton: false
      }).then(() => navigate('/admin/admins'));
    } catch (error) {
      console.error('Error updating admin:', error);
      
      let errorMessage = 'Gagal memperbarui data admin';
      
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        errorMessage = error.errors.join(', ');
      } else if (error.message && error.message !== 'Data tidak valid') {
        errorMessage = error.message;
      } else if (error.data && error.data.errors && Array.isArray(error.data.errors) && error.data.errors.length > 0) {
        errorMessage = error.data.errors.join(', ');
      } else if (error.data && error.data.message && error.data.message !== 'Data tidak valid') {
        errorMessage = error.data.message;
      } else if (error.response && error.response.data && error.response.data.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response && error.response.data && error.response.data.message && error.response.data.message !== 'Data tidak valid') {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
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
                      <li className="breadcrumb-item">
                        <Link to="/admin/admins" className="text-decoration-none text-muted">
                          Admin
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Edit Admin
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-pencil-square me-2"></i>Edit Data Admin
                  </h2>
                </div>
                <Link to="/admin/admins" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>Kembali
                </Link>
              </div>

              {/* Form */}
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-shield-lock me-2"></i>Form Data Admin
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      {fetching ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-2 text-muted">Memuat data admin...</p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit}>
                          <div className="row g-4">
                            {/* Basic Info */}
                            <div className="col-12">
                              <h6 className="fw-bold text-primary border-bottom pb-2">
                                <i className="bi bi-info-circle me-2"></i>Informasi Dasar
                              </h6>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-envelope me-1 text-primary"></i>Email <span className="text-danger">*</span>
                              </label>
                              <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="email@example.com"
                              />
                              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-lock me-1 text-primary"></i>Password (Opsional)
                              </label>
                              <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Kosongkan jika tidak ingin mengubah password"
                              />
                              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-person me-1 text-primary"></i>Nama Lengkap <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                placeholder="Nama lengkap admin"
                              />
                              {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-telephone me-1 text-primary"></i>Nomor Telepon <span className="text-danger">*</span>
                              </label>
                              <input
                                type="tel"
                                className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                placeholder="081234567890"
                              />
                              {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
                            </div>

                            {/* Additional Info */}
                            <div className="col-12">
                              <h6 className="fw-bold text-primary border-bottom pb-2 mt-4">
                                <i className="bi bi-plus-circle me-2"></i>Informasi Tambahan
                              </h6>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                <i className="bi bi-image me-1 text-primary"></i>URL Foto
                              </label>
                              <input
                                type="url"
                                className="form-control"
                                name="photo"
                                value={formData.photo}
                                onChange={handleInputChange}
                                placeholder="https://example.com/photo.jpg"
                              />
                            </div>

                            {/* Submit */}
                            <div className="col-12">
                              <hr className="my-4" />
                              <div className="d-flex justify-content-end gap-3">
                                <button
                                  type="submit"
                                  className="btn btn-primary px-4"
                                  disabled={loading}
                                  style={{ minWidth: '160px' }}
                                >
                                  {loading ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2" style={{ width: '1rem', height: '1rem' }}></span>
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
                            </div>
                          </div>
                        </form>
                      )}
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

export default AdminUpdatePage;
