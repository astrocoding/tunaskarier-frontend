import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getStudentById, updateStudent } from '../../apis/adminApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';
import '../../styles/Admin.css';

const StudentUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    nis: '',
    full_name: '',
    email: '',
    password: '',
    role: 'student',
    gender: '',
    birth_date: '',
    phone_number: '',
    address: '',
    class: '',
    major: '',
    school_name: '',
    photo: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      
      setFetching(true);
      try {
        const response = await getStudentById(id);
        const student = response.data;
        
        // Format birth_date for input field
        const formattedBirthDate = student.birth_date ? student.birth_date.split('T')[0] : '';
        
        setFormData({
          nis: student.nis || '',
          full_name: student.full_name || '',
          email: student.email || '',
          password: '', // Don't populate password for security
          role: student.role || 'student',
          gender: student.gender || '',
          birth_date: formattedBirthDate,
          phone_number: student.phone_number || '',
          address: student.address || '',
          class: student.class || '',
          major: student.major || '',
          school_name: student.school_name || '',
          photo: student.photo || '',
          bio: student.bio || ''
        });
      } catch (error) {
        console.error('Error fetching student:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal memuat data siswa',
          confirmButtonText: 'OK'
        }).then(() => navigate('/admin/students'));
      } finally {
        setFetching(false);
      }
    };

    fetchStudent();
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
    
    if (!formData.nis.trim()) newErrors.nis = 'NIS wajib diisi';
    else if (formData.nis.trim().length < 8) newErrors.nis = 'NIS minimal 8 karakter';
    
    if (!formData.full_name.trim()) newErrors.full_name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    // Password is optional for updates
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (!formData.gender) newErrors.gender = 'Gender wajib dipilih';
    if (!formData.birth_date) newErrors.birth_date = 'Tanggal lahir wajib diisi';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Nomor telepon wajib diisi';
    if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi';
    if (!formData.class.trim()) newErrors.class = 'Kelas wajib diisi';
    if (!formData.major.trim()) newErrors.major = 'Jurusan wajib diisi';
    if (!formData.school_name.trim()) newErrors.school_name = 'Nama sekolah wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare data for API
      const studentData = {
        nis: formData.nis.trim(),
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        gender: formData.gender,
        birth_date: formData.birth_date,
        phone_number: formData.phone_number.trim(),
        address: formData.address.trim(),
        class: formData.class.trim(),
        major: formData.major.trim(),
        school_name: formData.school_name.trim(),
        photo: formData.photo.trim() || null,
        bio: formData.bio.trim() || null
      };

      // Only include password if it's been changed
      if (formData.password.trim()) {
        studentData.password = formData.password;
      }

      await updateStudent(id, studentData);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data siswa berhasil diperbarui',
        timer: 2000,
        showConfirmButton: false
      }).then(() => navigate('/admin/students'));
    } catch (error) {
      console.error('Error updating student:', error);
      
      let errorMessage = 'Gagal memperbarui data siswa';
      
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

  if (fetching) {
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
                        <Link to="/admin/students" className="text-decoration-none text-muted">
                          Siswa
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Edit Siswa
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-pencil-square me-2"></i>Edit Data Siswa
                  </h2>
                </div>
                <Link to="/admin/students" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>Kembali
                </Link>
              </div>

              {/* Form */}
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-warning text-dark">
                      <h5 className="mb-0">
                        <i className="bi bi-pencil-square me-2"></i>Form Edit Data Siswa
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
                              <i className="bi bi-person-badge me-1 text-primary"></i>NIS <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.nis ? 'is-invalid' : ''}`}
                              name="nis"
                              value={formData.nis}
                              onChange={handleInputChange}
                              placeholder="2024001"
                            />
                            {errors.nis && <div className="invalid-feedback">{errors.nis}</div>}
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
                              placeholder="Nama lengkap siswa"
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
                              <option value="student">Student</option>
                            </select>
                            <small className="text-muted">Role default untuk siswa</small>
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
                              <i className="bi bi-calendar-event me-1 text-primary"></i>Tanggal Lahir <span className="text-danger">*</span>
                            </label>
                            <input
                              type="date"
                              className={`form-control ${errors.birth_date ? 'is-invalid' : ''}`}
                              name="birth_date"
                              value={formData.birth_date}
                              onChange={handleInputChange}
                            />
                            {errors.birth_date && <div className="invalid-feedback">{errors.birth_date}</div>}
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

                          <div className="col-12">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-geo-alt me-1 text-primary"></i>Alamat <span className="text-danger">*</span>
                            </label>
                            <textarea
                              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Alamat lengkap"
                              rows="3"
                            ></textarea>
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                          </div>

                          {/* Academic Info */}
                          <div className="col-12">
                            <h6 className="fw-bold text-primary border-bottom pb-2 mt-4">
                              <i className="bi bi-mortarboard me-2"></i>Informasi Akademik
                            </h6>
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-building me-1 text-primary"></i>Nama Sekolah <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.school_name ? 'is-invalid' : ''}`}
                              name="school_name"
                              value={formData.school_name}
                              onChange={handleInputChange}
                              placeholder="SMK Negeri 1"
                            />
                            {errors.school_name && <div className="invalid-feedback">{errors.school_name}</div>}
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-people me-1 text-primary"></i>Kelas <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.class ? 'is-invalid' : ''}`}
                              name="class"
                              value={formData.class}
                              onChange={handleInputChange}
                              placeholder="XII IPA 1"
                            />
                            {errors.class && <div className="invalid-feedback">{errors.class}</div>}
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-book me-1 text-primary"></i>Jurusan <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.major ? 'is-invalid' : ''}`}
                              name="major"
                              value={formData.major}
                              onChange={handleInputChange}
                              placeholder="IPA, IPS, RPL"
                            />
                            {errors.major && <div className="invalid-feedback">{errors.major}</div>}
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

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              <i className="bi bi-chat-quote me-1 text-primary"></i>Bio
                            </label>
                            <textarea
                              className="form-control"
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              placeholder="Ceritakan tentang diri Anda"
                              rows="3"
                            ></textarea>
                          </div>

                          {/* Submit */}
                          <div className="col-12">
                            <hr className="my-4" />
                            <div className="d-flex justify-content-end gap-3">
                              <button
                                type="submit"
                                className="btn btn-warning"
                                disabled={loading}
                              >
                                {loading ? (
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

export default StudentUpdatePage;
