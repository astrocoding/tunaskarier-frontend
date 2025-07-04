import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getAllApplications } from '../../apis/adminApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadge = (status) => {
  const statusConfig = {
    'registered': { class: 'bg-info', text: 'Terdaftar', icon: 'bi-clock' },
    'reviewing': { class: 'bg-warning', text: 'Sedang Ditinjau', icon: 'bi-eye' },
    'accepted': { class: 'bg-success', text: 'Diterima', icon: 'bi-check-circle' },
    'rejected': { class: 'bg-danger', text: 'Ditolak', icon: 'bi-x-circle' }
  };
  
  const config = statusConfig[status] || statusConfig['registered'];
  return (
    <span className={`badge ${config.class} text-white px-2 py-1`}>
      <i className={`bi ${config.icon} me-1`}></i>
      {config.text}
    </span>
  );
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

  // Fetch data
  const fetchApplications = async (page = 1, limit = 5) => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllApplications(page, limit);
      
      // Handle the correct API response structure
      // response.data contains the application array directly
      // response.pagination contains pagination info
      const applicationData = Array.isArray(response.data) ? response.data : [];
      
      setApplications(applicationData);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Gagal memuat data aplikasi');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

  // Search filter (client-side) - ensure it always returns an array
  const filteredApplications = useMemo(() => {
    // Ensure applications is always an array
    const applicationArray = Array.isArray(applications) ? applications : [];
    
    if (!search) return applicationArray;
    
    return applicationArray.filter(a => {
      if (!a || typeof a !== 'object') return false;
      
      return (
        (a.student_name && a.student_name.toLowerCase().includes(search.toLowerCase())) ||
        (a.program_title && a.program_title.toLowerCase().includes(search.toLowerCase())) ||
        (a.company_name && a.company_name.toLowerCase().includes(search.toLowerCase())) ||
        (a.student_nis && a.student_nis.includes(search)) ||
        (a.status && a.status.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [applications, search]);

  // Pagination info
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(startIdx + (filteredApplications?.length || 0) - 1, total);

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handlePage = (p) => setPage(p);

  // Ensure filteredApplications is always an array for rendering
  const applicationsToRender = Array.isArray(filteredApplications) ? filteredApplications : [];

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
                      <li className="breadcrumb-item active text-primary">
                        Data Aplikasi Magang
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-inbox me-2"></i>Data Aplikasi Magang
                  </h2>
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
                      <th scope="col">ID Aplikasi</th>
                      <th scope="col">Siswa</th>
                      <th scope="col">Program</th>
                      <th scope="col">Perusahaan</th>
                      <th scope="col">Tanggal Apply</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                    ) : error ? (
                      <tr><td colSpan={7} className="text-center text-danger">{error}</td></tr>
                    ) : applicationsToRender.length === 0 ? (
                      <tr><td colSpan={7} className="text-center">Data tidak ditemukan</td></tr>
                    ) : (
                      applicationsToRender.map((application, idx) => (
                        <tr key={application?.id || idx}>
                          <td>
                            <div className="fw-semibold text-primary">#{application?.id || '-'}</div>
                            <small className="text-muted">NIS: {application?.student_nis || '-'}</small>
                          </td>
                          <td>
                            <div className="fw-semibold">{application?.student_name || '-'}</div>
                            <small className="text-muted">ID: {application?.id_student || '-'}</small>
                          </td>
                          <td>
                            <div className="fw-semibold">{application?.program_title || '-'}</div>
                            <small className="text-muted">ID: {application?.id_program || '-'}</small>
                          </td>
                          <td>
                            <div className="fw-semibold">{application?.company_name || '-'}</div>
                          </td>
                          <td>
                            <div className="fw-semibold">{formatDate(application?.apply_date)}</div>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {formatDate(application?.created_at)}
                            </small>
                          </td>
                          <td>{getStatusBadge(application?.status)}</td>
                          <td className="text-end table-actions">
                            <Link to={`/admin/applications/detail/${application?.id}`} className="btn btn-sm btn-outline-info" title="Detail">
                              <i className="bi bi-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                  <div>
                    Menampilkan {applicationsToRender.length === 0 ? 0 : startIdx} sampai {endIdx} dari {total} entri
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
        <AdminFooter />
      </div>
    </SidebarProvider>
  );
};

export default ApplicationPage;
