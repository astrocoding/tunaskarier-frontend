import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MentorNavbar from '../../components/mentor/MentorNavbar';
import MentorSidebar from '../../components/mentor/MentorSidebar';
import MentorFooter from '../../components/mentor/MentorFooter';
import { getAssessmentById, updateAssessment } from '../../apis/mentorApi';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import '../../styles/Admin.css';

const AssessmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    final_grade: '',
    final_feedback: '',
    mentor_feedback: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getAssessmentById(id);
        setAssessment(response.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat data assessment');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssessment();
    }
  }, [id]);

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

  // Get grade badge with categorization
  const getGradeBadge = (grade) => {
    if (!grade) return (
      <div className="d-flex flex-column align-items-center justify-content-center text-center">
        <span className="badge bg-secondary text-white px-3 py-2">Belum Dinilai</span>
      </div>
    );
    if (grade >= 86) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center">
          <span className="bg-success text-white px-3 py-2 fs-6 fw-bold mb-1" style={{borderRadius: '8px'}}>A</span>
          <span className="fw-semibold text-success mb-1">Excellent</span>
          <span className="text-muted small">({grade}/100)</span>
        </div>
      );
    } else if (grade >= 76) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center">
          <span className="bg-primary text-white px-3 py-2 fs-6 fw-bold mb-1" style={{borderRadius: '8px'}}>B</span>
          <span className="fw-semibold text-primary mb-1">Good</span>
          <span className="text-muted small">({grade}/100)</span>
        </div>
      );
    } else if (grade >= 60) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center">
          <span className="bg-warning text-dark px-3 py-2 fs-6 fw-bold mb-1" style={{borderRadius: '8px'}}>C</span>
          <span className="fw-semibold text-warning mb-1">Fair</span>
          <span className="text-muted small">({grade}/100)</span>
        </div>
      );
    } else {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center">
          <span className="bg-danger text-white px-3 py-2 fs-6 fw-bold mb-1" style={{borderRadius: '8px'}}>D</span>
          <span className="fw-semibold text-danger mb-1">Poor</span>
          <span className="text-muted small">({grade}/100)</span>
        </div>
      );
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'lulus': { class: 'bg-success', text: 'Lulus', icon: 'bi-check-circle' },
      'finished': { class: 'bg-success', text: 'Selesai', icon: 'bi-flag-checkered' },
      'withdraw': { class: 'bg-warning', text: 'Mundur', icon: 'bi-arrow-left-circle' },
      'not_started': { class: 'bg-secondary', text: 'Belum Mulai', icon: 'bi-clock' }
    };
    
    const config = statusConfig[status] || statusConfig['not_started'];
    return (
      <span className={`badge ${config.class} text-white px-3 py-2`}>
        <i className={`bi ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  // Open edit modal and fill form
  const handleOpenEditModal = () => {
    setEditForm({
      final_grade: assessment.final_grade || '',
      final_feedback: assessment.final_feedback || '',
      mentor_feedback: assessment.mentor_feedback || ''
    });
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditLoading(false);
    setToast({ show: false, message: '', type: '' });
  };
  const handleEditInput = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setToast({ show: false, message: '', type: '' });
    // Validasi sederhana
    if (
      editForm.final_grade === '' ||
      isNaN(editForm.final_grade) ||
      Number(editForm.final_grade) < 0 ||
      Number(editForm.final_grade) > 100
    ) {
      setToast({ show: true, message: 'Nilai akhir harus 0-100', type: 'error' });
      setEditLoading(false);
      return;
    }
    if (!editForm.final_feedback.trim()) {
      setToast({ show: true, message: 'Feedback akhir wajib diisi', type: 'error' });
      setEditLoading(false);
      return;
    }
    try {
      await updateAssessment(assessment.id, {
        final_grade: Number(editForm.final_grade),
        final_feedback: editForm.final_feedback,
        mentor_feedback: editForm.mentor_feedback
      });
      setToast({ show: true, message: 'Assessment berhasil diupdate!', type: 'success' });
      setTimeout(() => {
        setShowEditModal(false);
        setToast({ show: false, message: '', type: '' });
        // Refresh data
        window.location.reload();
      }, 1200);
    } catch (err) {
      setToast({ show: true, message: err.message || 'Gagal update assessment', type: 'error' });
    } finally {
      setEditLoading(false);
    }
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
                    <p className="text-muted">Memuat data assessment...</p>
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
                    <button onClick={() => navigate('/mentor/assessments')} className="btn btn-primary">
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

  if (!assessment) {
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
                    <i className="bi bi-file-earmark-x text-muted" style={{fontSize: '3rem'}}></i>
                    <h4 className="mt-3 text-muted">Assessment Tidak Ditemukan</h4>
                    <p className="text-muted">Data assessment yang Anda cari tidak ditemukan.</p>
                    <button onClick={() => navigate('/mentor/assessments')} className="btn btn-primary">
                      <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Assessment
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
                      <li className="breadcrumb-item"><a href="/mentor/assessments" className="text-decoration-none">Assessment</a></li>
                      <li className="breadcrumb-item active" aria-current="page">Detail Assessment</li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">Detail Assessment</h2>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/mentor/assessments" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>Kembali
                  </Link>
                  <button className="btn btn-primary" onClick={handleOpenEditModal}>
                    <i className="bi bi-pencil me-2"></i>Edit Assessment
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="row g-4">
                {/* Assessment Overview Card */}
                <div className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-4">
                      <div className="position-relative d-inline-block mb-4">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                             style={{width: '120px', height: '120px'}}>
                          <i className="bi bi-clipboard-check text-white" style={{fontSize: '3rem'}}></i>
                        </div>
                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2" style={{width: '35px', height: '35px'}}>
                          <i className="bi bi-check-circle-fill text-white"></i>
                        </div>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">{assessment.program_title}</h4>
                      <p className="text-muted mb-1">
                        <i className="bi bi-calendar-check text-primary me-2"></i>
                        {formatDate(assessment.assessment_date)}
                      </p>
                      {/* Grade badge below date */}
                      <div className="mb-2 d-flex flex-column align-items-center justify-content-center">
                        {getGradeBadge(assessment.final_grade)}
                      </div>
                      <div className="d-grid gap-2">
                        {getStatusBadge(assessment.final_status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student & Program Information */}
                <div className="col-lg-8 col-md-6">
                  <div className="card border-0 shadow-sm h-100 pt-3">
                    <div className="card-header bg-transparent border-0 pb-0">
                      <h5 className="fw-bold text-primary mb-0">
                        <i className="bi bi-person-circle me-2"></i>
                        Informasi Siswa & Program
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3 mb-2">
                            <i className="bi bi-person text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Nama Siswa</small>
                              <span className="fw-semibold">{assessment.student_name}</span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-person-badge text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">NIS</small>
                              <span className="fw-semibold">{assessment.student_nis}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center p-3 bg-light rounded-3 mb-2">
                            <i className="bi bi-building text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Perusahaan</small>
                              <span className="fw-semibold">{assessment.company_name}</span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center p-3 bg-light rounded-3">
                            <i className="bi bi-person-check text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-muted d-block">Mentor</small>
                              <span className="fw-semibold">{assessment.mentor_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Section - Full width, stacked */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm pt-3">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="fw-bold text-primary mb-0">
                        <i className="bi bi-chat-quote me-2"></i>
                        Feedback & Evaluasi
                      </h5>
                    </div>
                    <div className="card-body">
                      {/* Feedback Akhir */}
                      <div className="mb-4">
                        <h6 className="fw-bold text-primary mb-2">
                          <i className="bi bi-star-fill me-2"></i>
                          Feedback Akhir
                        </h6>
                        <div className="bg-light p-3 rounded-3 feedback-content">
                          <p className="mb-0 text-dark" style={{lineHeight: '1.6', wordWrap: 'break-word'}}>
                            {assessment.final_feedback || 'Tidak ada feedback akhir'}
                          </p>
                        </div>
                      </div>
                      {/* Feedback Mentor */}
                      <div>
                        <h6 className="fw-bold text-primary mb-2">
                          <i className="bi bi-person-check me-2"></i>
                          Feedback Mentor
                        </h6>
                        <div className="bg-light p-3 rounded-3 feedback-content">
                          <p className="mb-0 text-dark" style={{lineHeight: '1.6', wordWrap: 'break-word'}}>
                            {assessment.mentor_feedback || 'Tidak ada feedback mentor'}
                          </p>
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
      </div>
      {/* Edit Modal */}
      {showEditModal && (
        <>
          {/* Backdrop, click to close */}
          <div
            className="modal-backdrop fade show"
            style={{zIndex: 1040}}
            onClick={handleCloseEditModal}
          ></div>
          {/* Modal */}
          <div
            className="modal fade show"
            style={{display: 'block', zIndex: 1050}}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-pencil me-2"></i>
                    Edit Assessment
                  </h5>
                  <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Nilai Akhir <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="final_grade"
                        value={editForm.final_grade}
                        onChange={handleEditInput}
                        className="form-control"
                        min="0"
                        max="100"
                        required
                        placeholder="Masukkan nilai (0-100)"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Feedback Akhir <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="final_feedback"
                        value={editForm.final_feedback}
                        onChange={handleEditInput}
                        className="form-control"
                        rows="3"
                        required
                        placeholder="Berikan feedback tentang kemampuan teknis dan performa siswa..."
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Feedback Mentor
                      </label>
                      <textarea
                        name="mentor_feedback"
                        value={editForm.mentor_feedback}
                        onChange={handleEditInput}
                        className="form-control"
                        rows="3"
                        placeholder="Berikan feedback tentang sikap, kerja sama tim, dan komunikasi siswa..."
                      />
                    </div>
                    {/* Toast Notification */}
                    {toast.show && (
                      <div className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} mt-3`} role="alert">
                        {toast.message}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseEditModal}
                      disabled={editLoading}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={editLoading}
                      style={{ minWidth: '140px' }}
                    >
                      {editLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" style={{width: '1rem', height: '1rem'}} role="status" aria-hidden="true"></span>
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
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </SidebarProvider>
  );
};

export default AssessmentDetailPage;
