import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyFooter from '../../components/company/CompanyFooter';
import { createProgram, getMentorsCompany } from '../../apis/companyApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';

const ProgramCreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company_name: '',
    description: '',
    category: '',
    location: '',
    intern_type: 'onsite',
    duration: '',
    start_date: '',
    end_date: '',
    quota: '',
    status: 'open',
    photo: '',
    qualification: '',
    benefits: '',
    id_mentor: ''
  });
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMentors, setFetchingMentors] = useState(true);

  // Fetch mentors for dropdown
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await getMentorsCompany();
        setMentors(response.data || []);
      } catch (err) {
        console.error('Error fetching mentors:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal memuat data mentor',
          confirmButtonColor: '#d33',
        });
      } finally {
        setFetchingMentors(false);
      }
    };
    fetchMentors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.title || !form.company_name || !form.description || !form.category || 
        !form.location || !form.duration || !form.start_date || !form.end_date || 
        !form.quota || !form.qualification || !form.benefits || !form.id_mentor) {
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Semua field wajib diisi kecuali foto',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    
    if (form.quota <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Quota harus lebih dari 0',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    
    const startDate = new Date(form.start_date);
    const endDate = new Date(form.end_date);
    if (startDate >= endDate) {
      Swal.fire({
        icon: 'error',
        title: 'Validasi Gagal',
        text: 'Tanggal selesai harus setelah tanggal mulai',
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
      const programData = {
        title: form.title.trim(),
        company_name: form.company_name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        location: form.location.trim(),
        intern_type: form.intern_type,
        duration: form.duration.trim(),
        start_date: form.start_date,
        end_date: form.end_date,
        quota: parseInt(form.quota),
        status: form.status,
        qualification: form.qualification.trim(),
        benefits: form.benefits.trim(),
        id_mentor: form.id_mentor
      };
      
      // Tambahkan photo hanya jika ada dan tidak kosong
      if (form.photo && form.photo.trim() !== '') {
        programData.photo = form.photo.trim();
      }
      
      console.log('Data yang akan dikirim:', programData); // Debug log
      
      const res = await createProgram(programData);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: res.message || 'Program berhasil ditambahkan!',
        confirmButtonColor: '#28a745',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/company');
      });
      
    } catch (err) {
      console.error('Error detail:', err);
      let errorMessage = 'Gagal menambah program. Silakan coba lagi.';
      
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
                      <li className="breadcrumb-item active text-primary">
                        Tambah Program
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary">Tambah Program</h2>
                </div>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/company')}>
                  <i className="bi bi-arrow-left me-1"></i>Kembali
                </button>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Judul Program <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="title" 
                          value={form.title} 
                          onChange={handleChange} 
                          placeholder="Contoh: Internship Program 2024"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nama Perusahaan <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="company_name" 
                          value={form.company_name} 
                          onChange={handleChange} 
                          placeholder="Contoh: PT. Test Solutions"
                          required 
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Deskripsi <span className="text-danger">*</span></label>
                        <textarea 
                          className="form-control" 
                          name="description" 
                          value={form.description} 
                          onChange={handleChange} 
                          rows="4"
                          placeholder="Deskripsi lengkap program internship..."
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Kategori <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="category" 
                          value={form.category} 
                          onChange={handleChange} 
                          placeholder="Contoh: Technology, Marketing, Finance"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Lokasi <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="location" 
                          value={form.location} 
                          onChange={handleChange} 
                          placeholder="Contoh: Jakarta Selatan"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Tipe Internship <span className="text-danger">*</span></label>
                        <select 
                          className="form-select" 
                          name="intern_type" 
                          value={form.intern_type} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="onsite">Onsite</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Durasi <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="duration" 
                          value={form.duration} 
                          onChange={handleChange} 
                          placeholder="Contoh: 3 bulan"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Tanggal Mulai <span className="text-danger">*</span></label>
                        <input 
                          type="date" 
                          className="form-control" 
                          name="start_date" 
                          value={form.start_date} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Tanggal Selesai <span className="text-danger">*</span></label>
                        <input 
                          type="date" 
                          className="form-control" 
                          name="end_date" 
                          value={form.end_date} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Quota <span className="text-danger">*</span></label>
                        <input 
                          type="number" 
                          className="form-control" 
                          name="quota" 
                          value={form.quota} 
                          onChange={handleChange} 
                          min="1"
                          placeholder="Contoh: 10"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Status <span className="text-danger">*</span></label>
                        <select 
                          className="form-select" 
                          name="status" 
                          value={form.status} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Mentor <span className="text-danger">*</span></label>
                        <select 
                          className="form-select" 
                          name="id_mentor" 
                          value={form.id_mentor} 
                          onChange={handleChange} 
                          required
                          disabled={fetchingMentors}
                        >
                          <option value="">Pilih Mentor</option>
                          {mentors.map((mentor) => (
                            <option key={mentor?.id || 'unknown'} value={mentor?.mentor_id || ''}>
                              {mentor?.full_name || '-'} - {mentor?.position || '-'}
                            </option>
                          ))}
                        </select>
                        {fetchingMentors && <small className="text-muted">Memuat data mentor...</small>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Foto (URL)</label>
                        <input 
                          type="url" 
                          className="form-control" 
                          name="photo" 
                          value={form.photo} 
                          onChange={handleChange} 
                          placeholder="https://example.com/photo.jpg"
                        />
                        <small className="text-muted">Opsional</small>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Kualifikasi <span className="text-danger">*</span></label>
                        <textarea 
                          className="form-control" 
                          name="qualification" 
                          value={form.qualification} 
                          onChange={handleChange} 
                          rows="3"
                          placeholder="Syarat dan kualifikasi yang dibutuhkan..."
                          required 
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Benefit <span className="text-danger">*</span></label>
                        <textarea 
                          className="form-control" 
                          name="benefits" 
                          value={form.benefits} 
                          onChange={handleChange} 
                          rows="3"
                          placeholder="Benefit yang akan didapatkan..."
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading || fetchingMentors}
                        style={{ minWidth: '120px' }}
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
                        onClick={() => navigate('/company/programs')}
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

export default ProgramCreatePage;
