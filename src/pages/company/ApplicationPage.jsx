import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyFooter from '../../components/company/CompanyFooter';
import { getApplicationsCompany, updateApplicationStatus } from '../../apis/companyApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const statusBadge = (status) => {
  switch (status) {
    case 'registered':
      return <span className="badge bg-secondary-subtle text-secondary" style={{fontWeight:600, fontSize:'1em'}}>Terdaftar</span>;
    case 'reviewing':
      return <span className="badge bg-info-subtle text-info" style={{fontWeight:600, fontSize:'1em'}}>Sedang Direview</span>;
    case 'accepted':
      return <span className="badge bg-success-subtle text-success" style={{fontWeight:600, fontSize:'1em'}}>Diterima</span>;
    case 'rejected':
      return <span className="badge bg-danger-subtle text-danger" style={{fontWeight:600, fontSize:'1em'}}>Ditolak</span>;
    default:
      return <span className="badge bg-secondary-subtle text-secondary" style={{fontWeight:600, fontSize:'1em'}}>{status}</span>;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ApplicationPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('apply_date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editFeedback, setEditFeedback] = useState('');

  // Fetch data
  const fetchApplications = async (page = 1, limit = 5) => {
    setLoading(true);
    setError('');
    try {
      const response = await getApplicationsCompany(page, limit);
      setApplications(response.data || []);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Gagal memuat data aplikasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

  // Search and sort filter (client-side)
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;
    
    // Search filter
    if (search) {
      filtered = applications.filter(app =>
        app.student_name?.toLowerCase().includes(search.toLowerCase()) ||
        app.student_nis?.toLowerCase().includes(search.toLowerCase()) ||
        app.program_title?.toLowerCase().includes(search.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        app.status?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle date sorting
      if (sortField === 'apply_date' || sortField === 'created_at' || sortField === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [applications, search, sortField, sortDirection]);

  // Pagination info
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(startIdx + filteredAndSortedApplications.length - 1, total);

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handlePage = (p) => setPage(p);

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Open edit modal
  const handleEdit = (application) => {
    setSelectedApplication(application);
    setEditStatus(application.status);
    setEditFeedback(application.feedback || '');
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setEditStatus('');
    setEditFeedback('');
  };

  // Save status update
  const handleSaveStatus = async () => {
    if (!selectedApplication) return;
    
    setLoading(true);
    setError('');
    try {
      await updateApplicationStatus(selectedApplication.id, editStatus, editFeedback);
      await fetchApplications(page, limit); // refresh data
      handleCloseModal();
      Swal.fire('Berhasil!', 'Status aplikasi berhasil diubah', 'success');
    } catch (err) {
      Swal.fire('Gagal!', err.message || 'Gagal mengubah status aplikasi', 'error');
      setError(err.message || 'Gagal mengubah status aplikasi');
    } finally {
      setLoading(false);
    }
  };

  // Download handler
  const handleDownload = (url, filename) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      Swal.fire('Error', 'File tidak tersedia', 'error');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <i className="bi bi-arrow-down-up text-muted"></i>;
    return sortDirection === 'asc' ? 
      <i className="bi bi-arrow-up text-primary"></i> : 
      <i className="bi bi-arrow-down text-primary"></i>;
  };

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <CompanyNavbar />
        <div className="container-fluid">
          <div className="row">
            <CompanySidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2" style={{marginTop: '60px', marginBottom: '100px'}}>
                <div>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-2">
                      <li className="breadcrumb-item">
                        <Link to="/company" className="text-decoration-none text-muted">
                          Dashboard
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Data Aplikasi Program
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">Data Aplikasi Program</h2>
                </div>
              </div>
              <div className="table-responsive rounded-4 shadow-sm bg-white p-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <label className="me-2 mb-0">Tampilkan</label>
                    <select className="form-select form-select-sm" style={{width: '70px'}} value={limit} onChange={e => {setLimit(Number(e.target.value)); setPage(1);}}>
                      {PAGE_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <span className="ms-2">entri</span>
                  </div>
                  <div>
                    <label className="me-2 mb-0">Cari:</label>
                    <input type="search" className="form-control form-control-sm d-inline-block" style={{width: '180px'}} value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari..." />
                  </div>
                </div>
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('student_name')}>
                        <div className="d-flex align-items-center gap-1">
                          Nama Siswa <SortIcon field="student_name" />
                        </div>
                      </th>
                      <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('student_nis')}>
                        <div className="d-flex align-items-center gap-1">
                          NIS <SortIcon field="student_nis" />
                        </div>
                      </th>
                      <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('program_title')}>
                        <div className="d-flex align-items-center gap-1">
                          Program <SortIcon field="program_title" />
                        </div>
                      </th>
                      <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('company_name')}>
                        <div className="d-flex align-items-center gap-1">
                          Perusahaan <SortIcon field="company_name" />
                        </div>
                      </th>
                      <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('apply_date')}>
                        <div className="d-flex align-items-center gap-1">
                          Tanggal Apply <SortIcon field="apply_date" />
                        </div>
                      </th>
                      <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('status')}>
                        <div className="d-flex align-items-center gap-1">
                          Status <SortIcon field="status" />
                        </div>
                      </th>
                      <th scope="col">Dokumen</th>
                      <th scope="col" className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8} className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                    ) : error ? (
                      <tr><td colSpan={8} className="text-center text-danger">{error}</td></tr>
                    ) : filteredAndSortedApplications.length === 0 ? (
                      <tr><td colSpan={8} className="text-center">Data tidak ditemukan</td></tr>
                    ) : (
                      filteredAndSortedApplications.map((application, idx) => (
                        <tr key={application?.id || idx}>
                          <td>{application?.student_name || '-'}</td>
                          <td>{application?.student_nis || '-'}</td>
                          <td>{application?.program_title || '-'}</td>
                          <td>{application?.company_name || '-'}</td>
                          <td>{formatDate(application?.apply_date)}</td>
                          <td>{statusBadge(application?.status)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button 
                                onClick={() => handleDownload(application?.cv_url, 'CV')}
                                className="btn btn-sm btn-outline-primary"
                                title="Download CV"
                              >
                                <i className="bi bi-file-earmark-pdf"></i> CV
                              </button>
                              <button 
                                onClick={() => handleDownload(application?.recommendation_letter_url, 'Surat Rekomendasi')}
                                className="btn btn-sm btn-outline-info"
                                title="Download Surat Rekomendasi"
                              >
                                <i className="bi bi-file-earmark-pdf"></i> SR
                              </button>
                            </div>
                          </td>
                          <td className="text-end table-actions">
                            <button 
                              onClick={() => handleEdit(application)} 
                              className="btn btn-sm btn-outline-secondary me-1"
                              title="Edit Status"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            {application?.feedback && (
                              <button 
                                onClick={() => Swal.fire('Feedback', application.feedback, 'info')}
                                className="btn btn-sm btn-outline-warning"
                                title="Lihat Feedback"
                              >
                                <i className="bi bi-chat-dots"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                  <div>
                    Menampilkan {filteredAndSortedApplications.length === 0 ? 0 : startIdx} sampai {endIdx} dari {total} entri
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item${page === 1 ? ' disabled' : ''}`}><button className="page-link" onClick={handlePrev} disabled={page === 1}>Sebelumnya</button></li>
                      {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                        <li key={p} className={`page-item${p === page ? ' active' : ''}`}><button className="page-link" onClick={() => handlePage(p)}>{p}</button></li>
                      ))}
                      <li className={`page-item${page === totalPages ? ' disabled' : ''}`}><button className="page-link" onClick={handleNext} disabled={page === totalPages}>Berikutnya</button></li>
                    </ul>
                  </nav>
                </div>
              </div>
            </main>
          </div>
        </div>
        <CompanyFooter />

        {/* Edit Modal */}
        {showModal && (
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1050
            }}
            onClick={handleCloseModal}
          >
            <div 
              className="bg-white rounded-3 shadow-lg"
              style={{maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto'}}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="modal-title mb-0">Edit Status Aplikasi</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseModal}
                    aria-label="Close"
                  ></button>
                </div>
              </div>
              <div className="p-4">
                {selectedApplication && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Nama Siswa:</label>
                      <p className="mb-0">{selectedApplication.student_name}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Program:</label>
                      <p className="mb-0">{selectedApplication.program_title}</p>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label fw-bold">Status:</label>
                      <select 
                        id="status"
                        className="form-select" 
                        value={editStatus} 
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        <option value="registered">Terdaftar</option>
                        <option value="reviewing">Sedang Direview</option>
                        <option value="accepted">Diterima</option>
                        <option value="rejected">Ditolak</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="feedback" className="form-label fw-bold">
                        Feedback/Link:
                        {editStatus === 'reviewing' && <span className="text-info ms-1">(Link interview/test)</span>}
                        {editStatus === 'rejected' && <span className="text-danger ms-1">(Alasan penolakan)</span>}
                      </label>
                      <textarea 
                        id="feedback"
                        className="form-control" 
                        rows="3"
                        value={editFeedback} 
                        onChange={(e) => setEditFeedback(e.target.value)}
                        placeholder={
                          editStatus === 'reviewing' 
                            ? 'Masukkan link interview/test...' 
                            : editStatus === 'rejected'
                            ? 'Masukkan alasan penolakan...'
                            : 'Masukkan feedback (opsional)...'
                        }
                      ></textarea>
                      {editStatus === 'reviewing' && (
                        <div className="form-text text-info">
                          <i className="bi bi-info-circle me-1"></i>
                          Berikan link untuk interview atau tes yang akan diikuti oleh siswa
                        </div>
                      )}
                      {editStatus === 'rejected' && (
                        <div className="form-text text-danger">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          Berikan alasan penolakan yang jelas kepada siswa
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-top">
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                  >
                    Batal
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleSaveStatus}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Perubahan'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default ApplicationPage;
