import React, { useState, useEffect } from 'react';
import { getAppliedPrograms } from '../../apis/studentApi';
import StudentNavbar from '../../components/student/StudentNavbar';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentFooter from '../../components/student/StudentFooter';
import { useNavigate, Link } from 'react-router-dom';

const AppliedProgramPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppliedPrograms();
  }, [currentPage]);

  const fetchAppliedPrograms = async () => {
    try {
      setLoading(true);
      const response = await getAppliedPrograms(currentPage, 6);
      
      console.log('Applied Programs API Response:', response); // Debug log
      
      setApplications(response.data || []);
      setPagination(response.pagination || {});
      setError(null);
    } catch (err) {
      setError('Gagal memuat data aplikasi');
      console.error('Error fetching applied programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'registered': { class: 'bg-secondary', text: 'Terdaftar' },
      'reviewing': { class: 'bg-warning', text: 'Direview' },
      'accepted': { class: 'bg-success', text: 'Diterima' },
      'rejected': { class: 'bg-danger', text: 'Ditolak' }
    };

    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    
    return (
      <span className={`badge ${config.class} text-white px-3 py-2`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{background: '#f7fafd', minHeight: '100vh'}}>
      <StudentNavbar />
      <div className="container-fluid">
        <div className="row">
          <StudentSidebar />
          <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item"><Link to="/student" className="text-decoration-none">Dashboard</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Applied Programs</li>
                  </ol>
                </nav>
                <h2 className="fw-bold text-primary mb-0">Applied Programs</h2>
              </div>
              <div className="text-muted">
                Total: {pagination?.total || 0} aplikasi
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {applications.length === 0 && !loading ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="fas fa-file-alt fa-3x text-muted"></i>
                </div>
                <h5 className="text-muted">Belum ada aplikasi program</h5>
                <p className="text-muted">Anda belum mengajukan aplikasi untuk program apapun.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/student/programs')}
                >
                  Lihat Program Tersedia
                </button>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {applications.map((application) => (
                    <div key={application?.id || 'unknown'} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body p-4">
                          {/* Header with status badge */}
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div style={{flex: 1, minWidth: 0}}>
                              <h5 className="card-title fw-bold text-primary mb-1" style={{lineHeight: '1.2', wordBreak: 'break-word'}}>
                                {application?.program_title || '-'}
                              </h5>
                              <div className="text-muted" style={{fontSize: '1rem'}}>
                                <i className="fas fa-building me-2"></i>
                                {application?.company_name || '-'}
                              </div>
                            </div>
                            <div>
                              {getStatusBadge(application?.status)}
                            </div>
                          </div>

                          {/* Student Information */}
                          <div className="bg-light rounded p-3 mb-3">
                            <div className="row g-2">
                              <div className="col-6">
                                <small className="text-muted d-block fw-medium">Nama Siswa</small>
                                <span className="fw-semibold text-dark">{application?.student_name || '-'}</span>
                              </div>
                              <div className="col-6">
                                <small className="text-muted d-block fw-medium">NIS</small>
                                <span className="fw-semibold text-dark">{application?.student_nis || '-'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Application Date */}
                          <div className="mb-3">
                            <small className="text-muted d-block fw-medium mb-1">
                              <i className="fas fa-calendar-alt me-1"></i>
                              Tanggal Aplikasi
                            </small>
                            <span className="fw-medium text-dark">{formatDate(application?.apply_date)}</span>
                          </div>

                          {/* Feedback Section */}
                          {application?.feedback && (
                            <div className="mb-3">
                              <small className="text-muted d-block fw-medium mb-1">
                                <i className="fas fa-comment-alt me-1"></i>
                                Feedback
                              </small>
                              <div className="bg-warning bg-opacity-10 border border-warning border-opacity-25 p-2 rounded">
                                <small className="text-break text-dark">{application.feedback}</small>
                              </div>
                            </div>
                          )}

                          {/* Document Links */}
                          <div className="d-flex gap-2">
                            <a
                              href={application?.cv_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm flex-fill"
                              title="Lihat CV"
                            >
                              <i className="fas fa-file-pdf me-1"></i>
                              CV
                            </a>
                            <a
                              href={application?.recommendation_letter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-secondary btn-sm flex-fill"
                              title="Lihat Surat Rekomendasi"
                            >
                              <i className="fas fa-file-alt me-1"></i>
                              Surat Rekomendasi
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <nav aria-label="Applied programs pagination">
                      <ul className="pagination">
                        <li className={`page-item ${!pagination?.hasPrev ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination?.hasPrev}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                        </li>
                        
                        {Array.from({ length: pagination?.totalPages || 0 }, (_, i) => i + 1).map((page) => (
                          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${!pagination?.hasNext ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination?.hasNext}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <StudentFooter />
    </div>
  );
};

export default AppliedProgramPage;
