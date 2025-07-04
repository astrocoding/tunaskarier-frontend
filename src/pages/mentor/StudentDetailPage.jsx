import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MentorNavbar from '../../components/mentor/MentorNavbar';
import MentorSidebar from '../../components/mentor/MentorSidebar';
import MentorFooter from '../../components/mentor/MentorFooter';
import { getStudentById, getMentorPrograms, createAssessment } from '../../apis/mentorApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import '../../styles/Admin.css';

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Assessment form state
  const [assessmentForm, setAssessmentForm] = useState({
    id_program: '',
    final_grade: '',
    final_feedback: '',
    final_status: 'finished',
    mentor_feedback: '',
    assessment_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getStudentById(id);
        setStudent(response.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat data siswa');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const response = await getMentorPrograms();
      setPrograms(response.data || []);
    } catch (err) {
      // Handle error silently or show user-friendly message
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleOpenAssessmentModal = () => {
    setShowAssessmentModal(true);
    fetchPrograms();
  };

  const handleCloseAssessmentModal = () => {
    setShowAssessmentModal(false);
    setAssessmentForm({
      id_program: '',
      final_grade: '',
      final_feedback: '',
      final_status: 'finished',
      mentor_feedback: '',
      assessment_date: new Date().toISOString().split('T')[0]
    });
    setToast({ show: false, message: '', type: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssessmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setToast({ show: false, message: '', type: '' });

    try {
      // Validate that the student is assigned to this mentor
      
      // Get current user info from localStorage or context
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check if student is assigned to current mentor
      if (student.id_mentor && userInfo.id && student.id_mentor !== userInfo.id) {
        throw {
          status: 403,
          message: 'Anda hanya dapat memberikan assessment kepada siswa yang ditugaskan kepada Anda'
        };
      }

      const assessmentData = {
        id_student: student.student_id,
        ...assessmentForm
      };

      const result = await createAssessment(assessmentData);

      setToast({
        show: true,
        message: 'Assessment berhasil dibuat!',
        type: 'success'
      });
      
      setTimeout(() => {
        handleCloseAssessmentModal();
      }, 1500);
    } catch (err) {
      let errorMessage = 'Terjadi kesalahan saat membuat assessment';
      
      if (err.status === 403) {
        errorMessage = err.message || 'Anda tidak memiliki izin untuk membuat assessment untuk siswa ini';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.error) {
        errorMessage = err.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    return phone.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const getGenderIcon = (gender) => {
    return gender === 'male' ? 'bi-gender-male' : 'bi-gender-female';
  };

  const getGenderColor = (gender) => {
    return gender === 'male' ? 'text-primary' : 'text-pink';
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <MentorNavbar />
          <div className="container-fluid">
            <div className="row">
              <MentorSidebar />
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
          <MentorFooter />
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <MentorNavbar />
          <div className="container-fluid">
            <div className="row">
              <MentorSidebar />
              <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <i className="bi bi-exclamation-triangle text-danger" style={{fontSize: '3rem'}}></i>
                    <h4 className="mt-3 text-danger">Error</h4>
                    <p className="text-muted">{error}</p>
                    <button onClick={() => navigate('/mentor/students')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali
                    </button>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <MentorFooter />
        </div>
      </SidebarProvider>
    );
  }

  if (!student) {
    return (
      <SidebarProvider>
        <div style={{background: '#f7fafd', minHeight: '100vh'}}>
          <MentorNavbar />
          <div className="container-fluid">
            <div className="row">
              <MentorSidebar />
              <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                  <div className="text-center">
                    <i className="bi bi-person-x text-muted" style={{fontSize: '3rem'}}></i>
                    <h4 className="mt-3 text-muted">Siswa Tidak Ditemukan</h4>
                    <p className="text-muted">Data siswa yang Anda cari tidak ditemukan.</p>
                    <button onClick={() => navigate('/mentor/students')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Siswa
                    </button>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <MentorFooter />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <MentorNavbar />
        <div className="container-fluid">
          <div className="row">
            <MentorSidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-2">
                      <li className="breadcrumb-item"><a href="/mentor" className="text-decoration-none">Dashboard</a></li>
                      <li className="breadcrumb-item"><a href="/mentor/students" className="text-decoration-none">Siswa</a></li>
                      <li className="breadcrumb-item active" aria-current="page">Detail Siswa</li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">Detail Siswa</h2>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/mentor/students" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Kembali
                  </Link>
                  <button onClick={handleOpenAssessmentModal} className="btn btn-primary">
                    <i className="bi bi-clipboard-check me-2"></i>Buat Assessment
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="row g-4">
                {/* Profile Card */}
                <div className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-4">
                      <div className="position-relative d-inline-block mb-4">
                        <img 
                          src={student.photo || 'https://via.placeholder.com/150x150'} 
                          alt="Student" 
                          className="rounded-circle shadow-sm"
                          style={{width: '120px', height: '120px', objectFit: 'cover'}}
                        />
                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2" style={{width: '35px', height: '35px'}}>
                          <i className="bi bi-check-circle-fill text-white"></i>
                        </div>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">{student.full_name}</h4>
                      <p className="text-muted mb-3">
                        <i className={`bi ${getGenderIcon(student.gender)} ${getGenderColor(student.gender)} me-2`}></i>
                        {student.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                      </p>
                      <div className="d-grid gap-2">
                        <span className="badge bg-primary-subtle text-primary fs-6 py-2">
                          <i className="bi bi-person-badge me-2"></i>
                          {student.nis}
                        </span>
                        <span className="badge bg-info-subtle text-info fs-6 py-2">
                          <i className="bi bi-mortarboard me-2"></i>
                          {student.class}
                        </span>
                        <span className="badge bg-success-subtle text-success fs-6 py-2">
                          <i className="bi bi-book me-2"></i>
                          {student.major}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0 pb-0">
                      <h5 className="fw-bold text-primary mb-0">
                        <i className="bi bi-person-circle me-2"></i>
                        Informasi Pribadi
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-envelope text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Email</small>
                              <span className="fw-semibold">{student.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-telephone text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">No. Telepon</small>
                              <span className="fw-semibold">{formatPhoneNumber(student.phone_number)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-event text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Tanggal Lahir</small>
                              <span className="fw-semibold">{formatDate(student.birth_date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-start p-3 bg-light rounded-3">
                            <i className="bi bi-geo-alt text-primary me-3 fs-5 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Alamat</small>
                              <span className="fw-semibold">{student.address || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0 pb-0">
                      <h5 className="fw-bold text-primary mb-0">
                        <i className="bi bi-mortarboard me-2"></i>
                        Informasi Akademik
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-building text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Nama Sekolah</small>
                              <span className="fw-semibold">{student.school_name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-people text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Kelas</small>
                              <span className="fw-semibold">{student.class}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-book text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Jurusan</small>
                              <span className="fw-semibold">{student.major}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-start p-3 bg-light rounded-3">
                            <i className="bi bi-chat-quote text-primary me-3 fs-5 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Bio</small>
                              <span className="fw-semibold">{student.bio || 'Tidak ada bio'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="fw-bold text-primary mb-0">
                        <i className="bi bi-gear me-2"></i>
                        Informasi Sistem
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-person-badge text-primary fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">ID Siswa</small>
                              <span className="fw-semibold">{student.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-shield-check text-success fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Role</small>
                              <span className="fw-semibold text-capitalize">{student.role}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-plus text-info fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Dibuat Pada</small>
                              <span className="fw-semibold">{formatDate(student.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-calendar-check text-warning fs-1 mb-2"></i>
                            <div>
                              <small className="text-muted d-block">Diperbarui Pada</small>
                              <span className="fw-semibold">{formatDate(student.updated_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <MentorFooter />

        {/* Assessment Modal */}
        {showAssessmentModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-clipboard-check me-2"></i>
                    Buat Assessment - {student.full_name}
                  </h5>
                  <button type="button" className="btn-close" onClick={handleCloseAssessmentModal}></button>
                </div>
                <form onSubmit={handleSubmitAssessment}>
                  <div className="modal-body">
                    
                    <div className="row g-3">
                      {/* Program Selection */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-book me-2"></i>
                          Program <span className="text-danger">*</span>
                        </label>
                        <select
                          name="id_program"
                          value={assessmentForm.id_program}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                          disabled={loadingPrograms}
                        >
                          <option value="">Pilih Program</option>
                          {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                              {program.title}
                            </option>
                          ))}
                        </select>
                        {loadingPrograms && (
                          <small className="text-muted">
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Memuat program...
                          </small>
                        )}
                      </div>

                      {/* Final Grade */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-star me-2"></i>
                          Nilai Akhir <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          name="final_grade"
                          value={assessmentForm.final_grade}
                          onChange={handleInputChange}
                          className="form-control"
                          min="0"
                          max="100"
                          required
                          placeholder="Masukkan nilai (0-100)"
                        />
                      </div>

                      {/* Final Status */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-check-circle me-2"></i>
                          Status Akhir <span className="text-danger">*</span>
                        </label>
                        <select
                          name="final_status"
                          value={assessmentForm.final_status}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          <option value="finished">Selesai</option>
                          <option value="withdraw">Mundur</option>
                          <option value="not_started">Belum Mulai</option>
                        </select>
                      </div>

                      {/* Assessment Date */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-calendar me-2"></i>
                          Tanggal Assessment <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          name="assessment_date"
                          value={assessmentForm.assessment_date}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>

                      {/* Final Feedback */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-chat-quote me-2"></i>
                          Feedback Akhir <span className="text-danger">*</span>
                        </label>
                        <textarea
                          name="final_feedback"
                          value={assessmentForm.final_feedback}
                          onChange={handleInputChange}
                          className="form-control"
                          rows="3"
                          required
                          placeholder="Berikan feedback tentang kemampuan teknis dan performa siswa..."
                        />
                      </div>

                      {/* Mentor Feedback */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-person-check me-2"></i>
                          Feedback Mentor
                        </label>
                        <textarea
                          name="mentor_feedback"
                          value={assessmentForm.mentor_feedback}
                          onChange={handleInputChange}
                          className="form-control"
                          rows="3"
                          placeholder="Berikan feedback tentang sikap, kerja sama tim, dan komunikasi siswa..."
                        />
                      </div>

                      {/* Alert Notification */}
                      {toast.show && (
                        <div className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} mt-3`} role="alert">
                          <i className={`bi ${toast.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
                          {toast.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseAssessmentModal}
                      disabled={submitting}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                      style={{ minWidth: '140px' }}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" style={{width: '1rem', height: '1rem'}} role="status" aria-hidden="true"></span>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Simpan Assessment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Backdrop */}
        {showAssessmentModal && (
          <div className="modal-backdrop fade show"></div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default StudentDetailPage;
