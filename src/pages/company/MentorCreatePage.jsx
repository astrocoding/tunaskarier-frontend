import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyFooter from '../../components/company/CompanyFooter';
import { createMentor } from '../../apis/companyApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';

const MentorCreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    position: '',
    gender: 'male',
    phone_number: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.email || !form.password || !form.full_name || !form.position || 
        !form.phone_number || !form.department) {
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Semua field wajib diisi kecuali foto',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    
    if (form.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Password minimal 6 karakter',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    
    if (form.phone_number.length < 10) {
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Nomor telepon tidak valid',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // Pastikan data yang dikirim sesuai urutan yang diharapkan backend
      const mentorData = {
        email: form.email.trim(),
        password: form.password,
        role: 'mentor',
        full_name: form.full_name.trim(),
        position: form.position.trim(),
        gender: form.gender,
        phone_number: form.phone_number.trim(),
        department: form.department.trim()
      };
      
      const res = await createMentor(mentorData);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: res.message || 'Mentor berhasil ditambahkan!',
        confirmButtonColor: '#28a745',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/company/mentors');
      });
      
    } catch (err) {
      let errorMessage = 'Gagal menambah mentor. Silakan coba lagi.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.error) {
        errorMessage = err.error;
      }
      
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
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <CompanyNavbar />
        <div className="container-fluid">
          <div className="row">
            <CompanySidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '65px', marginBottom: '100px'}}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-2">
                      <li className="breadcrumb-item">
                        <Link to="/company" className="text-decoration-none text-muted">
                          Dashboard
                        </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/company/mentors" className="text-decoration-none text-muted">
                          Data Mentor
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Tambah Mentor
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary">Tambah Mentor</h2>
                </div>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/company/mentors')}>
                  <i className="bi bi-arrow-left me-1"></i>Kembali
                </button>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Email <span className="text-danger">*</span></label>
                        <input 
                          type="email" 
                          className="form-control" 
                          name="email" 
                          value={form.email} 
                          onChange={handleChange} 
                          placeholder="mentor@company.com"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Password <span className="text-danger">*</span></label>
                        <input 
                          type="password" 
                          className="form-control" 
                          name="password" 
                          value={form.password} 
                          onChange={handleChange} 
                          placeholder="Minimal 6 karakter"
                          minLength="6"
                          required 
                        />
                        <small className="text-muted">Minimal 6 karakter</small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nama Lengkap <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="full_name" 
                          value={form.full_name} 
                          onChange={handleChange} 
                          placeholder="Nama lengkap mentor"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Posisi <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="position" 
                          value={form.position} 
                          onChange={handleChange} 
                          placeholder="Contoh: Senior Developer"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Gender <span className="text-danger">*</span></label>
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
                      <div className="col-md-6">
                        <label className="form-label">Department <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="department" 
                          value={form.department} 
                          onChange={handleChange} 
                          placeholder="Contoh: IT Department"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">No. HP <span className="text-danger">*</span></label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          name="phone_number" 
                          value={form.phone_number} 
                          onChange={handleChange} 
                          placeholder="081234567890"
                          minLength="10"
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" style={{width: '1rem', height: '1rem'}} role="status" aria-hidden="true"></span>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-lg me-1"></i>
                            Simpan
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={() => navigate('/company/mentors')}
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </main>
          </div>
        </div>
        <CompanyFooter />
      </div>
    </SidebarProvider>
  );
};

export default MentorCreatePage; 