import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getMentorById, updateMentor } from '../../apis/adminApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';
import '../../styles/Admin.css';

const MentorUpdatePage = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    gender: '',
    phone_number: '',
    department: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const response = await getMentorById(mentorId);
        const mentorData = response.data;
        setFormData({
          full_name: mentorData.full_name || '',
          position: mentorData.position || '',
          gender: mentorData.gender || '',
          phone_number: mentorData.phone_number || '',
          department: mentorData.department || '',
          email: mentorData.email || '',
          password: ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil data mentor');
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) newErrors.full_name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    // Password is optional for updates
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (!formData.position.trim()) newErrors.position = 'Posisi wajib diisi';
    if (!formData.gender) newErrors.gender = 'Gender wajib dipilih';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Nomor telepon wajib diisi';
    if (!formData.department.trim()) newErrors.department = 'Departemen wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Prepare data for API
      const mentorData = {
        email: formData.email.trim(),
        role: 'mentor',
        full_name: formData.full_name.trim(),
        position: formData.position.trim(),
        gender: formData.gender,
        phone_number: formData.phone_number.trim(),
        department: formData.department.trim()
      };

      // Only include password if it's been changed
      if (formData.password.trim()) {
        mentorData.password = formData.password;
      }

      await updateMentor(mentorId, mentorData);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data mentor berhasil diperbarui',
        timer: 2000,
        showConfirmButton: false
      }).then(() => navigate('/admin/mentors'));
    } catch (error) {
      console.error('Error updating mentor:', error);
      
      let errorMessage = 'Gagal memperbarui data mentor';
      
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
      setSubmitting(false);
    }
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
                        <Link to="/admin/mentors" className="text-decoration-none text-muted">
                          Mentor
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Edit Mentor
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-pencil-square me-2"></i>Edit Data Mentor
                  </h2>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/admin/mentors" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Kembali
                  </Link>
                  <Link to={`/admin/mentors/detail/${mentorId}`} className="btn btn-outline-info">
                    <i className="bi bi-eye me-2"></i>Lihat Detail
                  </Link>
                </div>
              </div>

              {/* Form */}
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-warning text-dark">
                      <h5 className="mb-0">
                        <i className="bi bi-pencil-square me-2"></i>Form Edit Data Mentor
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
                              <i className="bi bi-person me-1 text-primary"></i>Nama Lengkap <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                              name="full_name"
                              value={formData.full_name}
                              onChange={handleInputChange}
                              placeholder="Nama lengkap mentor"
                            />
                            {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
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
                              <i className="bi bi-lock me-1 text-primary"></i>Password
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
                            <small className="text-muted">Kosongkan jika tidak ingin mengubah password</small>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-shield-check me-1 text-primary"></i>Role
                            </label>
                            <select
                              className="form-select"
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                            >
                              <option value="mentor">Mentor</option>
                            </select>
                            <small className="text-muted">Role default untuk mentor</small>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-briefcase me-1 text-primary"></i>Posisi <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.position ? 'is-invalid' : ''}`}
                              name="position"
                              value={formData.position}
                              onChange={handleInputChange}
                              placeholder="Senior Developer, Project Manager, dll"
                            />
                            {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-gender-ambiguous me-1 text-primary"></i>Gender <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                            >
                              <option value="">Pilih Gender</option>
                              <option value="male">Laki-laki</option>
                              <option value="female">Perempuan</option>
                            </select>
                            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
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

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-building me-1 text-primary"></i>Departemen <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              placeholder="IT Development, Marketing, HR, dll"
                            />
                            {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                          </div>

                          {/* Submit */}
                          <div className="col-12">
                            <hr className="my-4" />
                            <div className="d-flex justify-content-end gap-3">
                              <button
                                type="submit"
                                className="btn btn-warning"
                                disabled={submitting}
                                style={{ minWidth: '140px' }}
                              >
                                {submitting ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" style={{ width: '1rem', height: '1rem' }}></span>
                                    Menyimpan...
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-check-circle me-2"></i>
                                    Update Data
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

export default MentorUpdatePage;
