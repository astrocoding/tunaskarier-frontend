import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { createCompany } from '../../apis/adminApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';
import '../../styles/Admin.css';

const CompanyCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'company',
    company_name: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    company_website: '',
    company_logo: '',
    company_description: ''
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (!formData.company_name.trim()) newErrors.company_name = 'Nama perusahaan wajib diisi';
    if (!formData.company_address.trim()) newErrors.company_address = 'Alamat perusahaan wajib diisi';
    if (!formData.company_phone.trim()) newErrors.company_phone = 'Nomor telepon perusahaan wajib diisi';
    if (!formData.company_email.trim()) newErrors.company_email = 'Email perusahaan wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email)) {
      newErrors.company_email = 'Format email perusahaan tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const companyData = {
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        company_name: formData.company_name.trim(),
        company_address: formData.company_address.trim(),
        company_phone: formData.company_phone.trim(),
        company_email: formData.company_email.trim(),
        company_website: formData.company_website.trim() || null,
        company_logo: formData.company_logo.trim() || null,
        company_description: formData.company_description.trim() || null
      };

      await createCompany(companyData);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data perusahaan berhasil ditambahkan',
        timer: 2000,
        showConfirmButton: false
      }).then(() => navigate('/admin/companies'));
    } catch (error) {
      console.error('Error creating company:', error);
      
      let errorMessage = 'Gagal menambahkan data perusahaan';
      
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
                        <Link to="/admin/companies" className="text-decoration-none text-muted">
                          Perusahaan
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Tambah Perusahaan
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-building-add me-2"></i>Tambah Perusahaan Baru
                  </h2>
                </div>
                <Link to="/admin/companies" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>Kembali
                </Link>
              </div>

              {/* Form */}
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-building-add me-2"></i>Form Data Perusahaan
                      </h5>
                    </div>
                    <div className="card-body p-4">
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
                              <i className="bi bi-lock me-1 text-primary"></i>Password <span className="text-danger">*</span>
                            </label>
                            <input
                              type="password"
                              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Minimal 6 karakter"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                          </div>

                          {/* Hidden role field */}
                          <input type="hidden" name="role" value="company" />

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-building me-1 text-primary"></i>Nama Perusahaan <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.company_name ? 'is-invalid' : ''}`}
                              name="company_name"
                              value={formData.company_name}
                              onChange={handleInputChange}
                              placeholder="PT. Contoh Indonesia"
                            />
                            {errors.company_name && <div className="invalid-feedback">{errors.company_name}</div>}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-telephone me-1 text-primary"></i>Nomor Telepon <span className="text-danger">*</span>
                            </label>
                            <input
                              type="tel"
                              className={`form-control ${errors.company_phone ? 'is-invalid' : ''}`}
                              name="company_phone"
                              value={formData.company_phone}
                              onChange={handleInputChange}
                              placeholder="081234567890"
                            />
                            {errors.company_phone && <div className="invalid-feedback">{errors.company_phone}</div>}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-envelope me-1 text-primary"></i>Email Perusahaan <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className={`form-control ${errors.company_email ? 'is-invalid' : ''}`}
                              name="company_email"
                              value={formData.company_email}
                              onChange={handleInputChange}
                              placeholder="contact@company.com"
                            />
                            {errors.company_email && <div className="invalid-feedback">{errors.company_email}</div>}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-link-45deg me-1 text-primary"></i>Website
                            </label>
                            <input
                              type="url"
                              className="form-control"
                              name="company_website"
                              value={formData.company_website}
                              onChange={handleInputChange}
                              placeholder="https://company.com"
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-geo-alt me-1 text-primary"></i>Alamat Perusahaan <span className="text-danger">*</span>
                            </label>
                            <textarea
                              className={`form-control ${errors.company_address ? 'is-invalid' : ''}`}
                              name="company_address"
                              value={formData.company_address}
                              onChange={handleInputChange}
                              placeholder="Alamat lengkap perusahaan"
                              rows="3"
                            ></textarea>
                            {errors.company_address && <div className="invalid-feedback">{errors.company_address}</div>}
                          </div>

                          {/* Additional Info */}
                          <div className="col-12">
                            <h6 className="fw-bold text-primary border-bottom pb-2 mt-4">
                              <i className="bi bi-plus-circle me-2"></i>Informasi Tambahan
                            </h6>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-image me-1 text-primary"></i>URL Logo
                            </label>
                            <input
                              type="url"
                              className="form-control"
                              name="company_logo"
                              value={formData.company_logo}
                              onChange={handleInputChange}
                              placeholder="https://example.com/logo.png"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-chat-quote me-1 text-primary"></i>Deskripsi Perusahaan
                            </label>
                            <textarea
                              className="form-control"
                              name="company_description"
                              value={formData.company_description}
                              onChange={handleInputChange}
                              placeholder="Deskripsi singkat tentang perusahaan"
                              rows="3"
                            ></textarea>
                          </div>

                          {/* Submit */}
                          <div className="col-12">
                            <hr className="my-4" />
                            <div className="d-flex justify-content-end gap-3">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ minWidth: '140px' }}
                              >
                                {loading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" style={{ width: '1rem', height: '1rem' }}></span>
                                    Menyimpan...
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-check-circle me-2"></i>
                                    Simpan Data
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
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

export default CompanyCreatePage;
