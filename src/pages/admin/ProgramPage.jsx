import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getAllPrograms } from '../../apis/adminApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusBadge = (status) => {
  const statusConfig = {
    'open': { class: 'bg-success', text: 'Terbuka', icon: 'bi-check-circle' },
    'closed': { class: 'bg-danger', text: 'Ditutup', icon: 'bi-x-circle' },
    'draft': { class: 'bg-warning', text: 'Draft', icon: 'bi-pencil' }
  };
  
  const config = statusConfig[status] || statusConfig['draft'];
  return (
    <span className={`badge ${config.class} text-white px-2 py-1`}>
      <i className={`bi ${config.icon} me-1`}></i>
      {config.text}
    </span>
  );
};

const getInternTypeBadge = (type) => {
  const typeConfig = {
    'onsite': { class: 'bg-primary', text: 'Onsite', icon: 'bi-building' },
    'remote': { class: 'bg-info', text: 'Remote', icon: 'bi-laptop' },
    'hybrid': { class: 'bg-secondary', text: 'Hybrid', icon: 'bi-phone' }
  };
  
  const config = typeConfig[type] || typeConfig['onsite'];
  return (
    <span className={`badge ${config.class} text-white px-2 py-1`}>
      <i className={`bi ${config.icon} me-1`}></i>
      {config.text}
    </span>
  );
};

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data
  const fetchPrograms = async (page = 1, limit = 5) => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllPrograms(page, limit);
      
      // Handle the correct API response structure
      // response.data contains the program array directly
      // response.pagination contains pagination info
      const programData = Array.isArray(response.data) ? response.data : [];
      
      setPrograms(programData);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Gagal memuat data program');
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

  // Search filter (client-side) - ensure it always returns an array
  const filteredPrograms = useMemo(() => {
    // Ensure programs is always an array
    const programArray = Array.isArray(programs) ? programs : [];
    
    if (!search) return programArray;
    
    return programArray.filter(p => {
      if (!p || typeof p !== 'object') return false;
      
      return (
        (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
        (p.company_name && p.company_name.toLowerCase().includes(search.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
        (p.location && p.location.toLowerCase().includes(search.toLowerCase())) ||
        (p.mentor_name && p.mentor_name.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [programs, search]);

  // Pagination info
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(startIdx + (filteredPrograms?.length || 0) - 1, total);

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handlePage = (p) => setPage(p);

  // Ensure filteredPrograms is always an array for rendering
  const programsToRender = Array.isArray(filteredPrograms) ? filteredPrograms : [];

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
                        Data Program Magang
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-briefcase me-2"></i>Data Program Magang
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
                      <th scope="col">Logo</th>
                      <th scope="col">Judul Program</th>
                      <th scope="col">Perusahaan</th>
                      <th scope="col">Kategori</th>
                      <th scope="col">Lokasi</th>
                      <th scope="col">Tipe</th>
                      <th scope="col">Status</th>
                      <th scope="col">Mentor</th>
                      <th scope="col" className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={9} className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                    ) : error ? (
                      <tr><td colSpan={9} className="text-center text-danger">{error}</td></tr>
                    ) : programsToRender.length === 0 ? (
                      <tr><td colSpan={9} className="text-center">Data tidak ditemukan</td></tr>
                    ) : (
                      programsToRender.map((program, idx) => (
                        <tr key={program?.id || idx}>
                          <td>
                            <img 
                              src={program?.photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} 
                              className="table-avatar" 
                              alt="Company" 
                              style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                            />
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{program?.title || '-'}</div>
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {formatDate(program?.start_date)} - {formatDate(program?.end_date)}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold">{program?.company_name || '-'}</div>
                            <small className="text-muted">{program?.duration || '-'}</small>
                          </td>
                          <td>
                            <span className="badge bg-info-subtle text-info" style={{fontWeight:600, fontSize:'0.85em'}}>
                              {program?.category || '-'}
                            </span>
                          </td>
                          <td>
                            <div className="fw-semibold">{program?.location || '-'}</div>
                            <small className="text-muted">{program?.quota || 0} posisi</small>
                          </td>
                          <td>{getInternTypeBadge(program?.intern_type)}</td>
                          <td>{getStatusBadge(program?.status)}</td>
                          <td>
                            <div className="fw-semibold">{program?.mentor_name || '-'}</div>
                          </td>
                          <td className="text-end table-actions">
                            <Link to={`/admin/programs/detail/${program?.id}`} className="btn btn-sm btn-outline-info" title="Detail">
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
                    Menampilkan {programsToRender.length === 0 ? 0 : startIdx} sampai {endIdx} dari {total} entri
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

export default ProgramPage;
