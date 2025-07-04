import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { registerStudent } from '../apis/authApi';
import logo from '../assets/images/logo_tunaskarier.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    nis: '',
    full_name: '',
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    // NIS validation
    if (!formData.nis) {
      newErrors.nis = 'NIS wajib diisi';
    }

    // Full name validation
    if (!formData.full_name) {
      newErrors.full_name = 'Nama lengkap wajib diisi';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Jenis kelamin wajib dipilih';
    }

    // Birth date validation
    if (!formData.birth_date) {
      newErrors.birth_date = 'Tanggal lahir wajib diisi';
    }

    // Phone number validation
    if (!formData.phone_number) {
      newErrors.phone_number = 'Nomor HP wajib diisi';
    } else if (!/^08\d{8,11}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Format nomor HP tidak valid (contoh: 08123456789)';
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = 'Alamat wajib diisi';
    }

    // Class validation
    if (!formData.class) {
      newErrors.class = 'Kelas wajib diisi';
    }

    // Major validation
    if (!formData.major) {
      newErrors.major = 'Jurusan wajib diisi';
    }

    // School name validation
    if (!formData.school_name) {
      newErrors.school_name = 'Nama sekolah wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Pendaftaran Gagal',
        text: 'Mohon perbaiki kesalahan pada form',
        confirmButtonColor: '#d33',
      });
      return;
    }

    setLoading(true);
    try {
      await registerStudent(formData);
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Akun berhasil dibuat. Silakan login dengan akun Anda.',
        icon: 'success',
        confirmButtonColor: '#28a745',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      const errorMessage = error.message || error.error || 'Terjadi kesalahan saat mendaftar';
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #eff6fe 100%)'}}>
      <div className="row justify-content-center w-100" style={{marginTop: '50px', marginBottom: '50px'}}>
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="bg-white rounded-4 shadow-lg overflow-hidden" style={{minHeight:'600px'}}>
            {/* Logo Section */}
            <div className="text-center py-4 px-4" style={{background: 'linear-gradient(135deg, #f7fafd 0%, #e2e8f0 100%)'}}>
              <img 
                src={logo} 
                alt="Logo TunasKarier" 
                style={{
                  height: '60px',
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  cursor: 'pointer'
                }} 
                onClick={() => navigate('/')}
              />
              <h4 className="text-primary fw-bold mt-3 mb-0">Daftar Akun Siswa</h4>
              <p className="text-muted mb-0">Lengkapi data diri Anda untuk bergabung dengan TunasKarier</p>
            </div>
            
            {/* Form Section */}
            <div className="p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Email & Password */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-envelope me-2 text-primary"></i>
                      Email <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="email" 
                      className={`form-control border-2 ${errors.email ? 'is-invalid' : ''}`}
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Masukkan email Anda" 
                      required 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label htmlFor="password" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-lock me-2 text-primary"></i>
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className={`form-control border-2 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                        id="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Minimal 6 karakter" 
                        required 
                        style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                      />
                      <button 
                        type="button" 
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3 text-muted"
                        onClick={togglePasswordVisibility}
                        style={{border: 'none', background: 'none'}}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  {/* NIS & Nama Lengkap */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="nis" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-card-text me-2 text-primary"></i>
                      NIS <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control border-2 ${errors.nis ? 'is-invalid' : ''}`}
                      id="nis" 
                      name="nis" 
                      value={formData.nis}
                      onChange={handleInputChange}
                      placeholder="Nomor Induk Siswa" 
                      required 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                    {errors.nis && <div className="invalid-feedback">{errors.nis}</div>}
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label htmlFor="full_name" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-person me-2 text-primary"></i>
                      Nama Lengkap <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control border-2 ${errors.full_name ? 'is-invalid' : ''}`}
                      id="full_name" 
                      name="full_name" 
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Nama lengkap" 
                      required 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                    {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
                  </div>

                  {/* Gender & Tanggal Lahir */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-gender-ambiguous me-2 text-primary"></i>
                      Jenis Kelamin <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="gender" 
                          id="genderMale" 
                          value="male" 
                          checked={formData.gender === 'male'}
                          onChange={handleInputChange}
                          required 
                        />
                        <label className="form-check-label" htmlFor="genderMale">Laki-laki</label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="gender" 
                          id="genderFemale" 
                          value="female" 
                          checked={formData.gender === 'female'}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="genderFemale">Perempuan</label>
                      </div>
                    </div>
                    {errors.gender && <div className="text-danger small mt-1">{errors.gender}</div>}
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label htmlFor="birth_date" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-calendar me-2 text-primary"></i>
                      Tanggal Lahir <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="date" 
                      className={`form-control border-2 ${errors.birth_date ? 'is-invalid' : ''}`}
                      id="birth_date" 
                      name="birth_date" 
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      required 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                    {errors.birth_date && <div className="invalid-feedback">{errors.birth_date}</div>}
                  </div>

                  {/* No. HP & Kelas */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="phone_number" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-telephone me-2 text-primary"></i>
                      No. HP <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control border-2 ${errors.phone_number ? 'is-invalid' : ''}`}
                      id="phone_number" 
                      name="phone_number" 
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="08xxxxxxxxxx" 
                      required 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                    {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label htmlFor="class" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-mortarboard me-2 text-primary"></i>
                      Kelas <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control border-2 ${errors.class ? 'is-invalid' : ''}`}
                      id="class" 
                      name="class" 
                      value={formData.class}
                      onChange={handleInputChange}
                      placeholder="Contoh: XII IPA 1" 
                      required 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                    {errors.class && <div className="invalid-feedback">{errors.class}</div>}
                  </div>

                  {/* Jurusan & Nama Sekolah */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="major" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-book me-2 text-primary"></i>
                      Jurusan <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control border-2 ${errors.major ? 'is-invalid' : ''}`}
                      id="major" 
                      name="major" 
                      value={formData.major}
                      onChange={handleInputChange}
                      placeholder="Contoh: IPA" 
                      required 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                    {errors.major && <div className="invalid-feedback">{errors.major}</div>}
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label htmlFor="school_name" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-building me-2 text-primary"></i>
                      Nama Sekolah <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control border-2 ${errors.school_name ? 'is-invalid' : ''}`}
                      id="school_name" 
                      name="school_name" 
                      value={formData.school_name}
                      onChange={handleInputChange}
                      placeholder="Nama sekolah" 
                      required 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                    {errors.school_name && <div className="invalid-feedback">{errors.school_name}</div>}
                  </div>

                  {/* URL Foto */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="photo" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-image me-2 text-primary"></i>
                      URL Foto (Opsional)
                    </label>
                    <input 
                      type="url" 
                      className="form-control border-2"
                      id="photo" 
                      name="photo" 
                      value={formData.photo}
                      onChange={handleInputChange}
                      placeholder="https://example.com/photo.jpg" 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                  </div>

                  {/* Alamat */}
                  <div className="col-12">
                    <label htmlFor="address" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      Alamat <span className="text-danger">*</span>
                    </label>
                    <textarea 
                      className={`form-control border-2 ${errors.address ? 'is-invalid' : ''}`}
                      id="address" 
                      name="address" 
                      rows="2" 
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Alamat lengkap" 
                      required
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    ></textarea>
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  {/* Bio */}
                  <div className="col-12">
                    <label htmlFor="bio" className="form-label fw-semibold text-dark mb-2">
                      <i className="bi bi-chat-quote me-2 text-primary"></i>
                      Bio (Opsional)
                    </label>
                    <textarea 
                      className="form-control border-2"
                      id="bio" 
                      name="bio" 
                      rows="3" 
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Ceritakan sedikit tentang diri Anda..." 
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-3 fw-semibold mt-4" 
                  disabled={loading}
                  style={{
                    background: '#5ac1f4',
                    border: 'none',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = '#4bb8e8';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(90, 193, 244, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = '#5ac1f4';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" style={{width: '1rem', height: '1rem'}} role="status" aria-hidden="true"></span>
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Daftar
                    </>
                  )}
                </button>
              </form>
              
              <div className="text-center mt-3">
                <span className="text-muted">Sudah punya akun?</span>
                <a href="/login" className="text-primary fw-semibold ms-1 text-decoration-none">
                  Masuk disini
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="position-fixed bottom-0 end-0 p-3 small" style={{zIndex:10, color: '#5ac1f4'}}>
        &copy; {new Date().getFullYear()} <b>TunasKarier</b>
      </footer>
    </div>
  );
};

export default RegisterPage;
