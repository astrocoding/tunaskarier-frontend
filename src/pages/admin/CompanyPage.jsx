import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getAllCompanies, deleteCompany } from '../../apis/adminApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
};

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data
  const fetchCompanies = async (page = 1, limit = 5) => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllCompanies(page, limit);
      
      // Handle the correct API response structure
      // response.data contains the company array directly
      // response.pagination contains pagination info
      const companyData = Array.isArray(response.data) ? response.data : [];
      
      setCompanies(companyData);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Gagal memuat data perusahaan');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

  // Search filter (client-side) - ensure it always returns an array
  const filteredCompanies = useMemo(() => {
    // Ensure companies is always an array
    const companyArray = Array.isArray(companies) ? companies : [];
    
    if (!search) return companyArray;
    
    return companyArray.filter(c => {
      if (!c || typeof c !== 'object') return false;
      
      return (
        (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
        (c.company_name && c.company_name.toLowerCase().includes(search.toLowerCase())) ||
        (c.company_phone && c.company_phone.includes(search)) ||
        (c.company_email && c.company_email.toLowerCase().includes(search.toLowerCase())) ||
        (c.company_address && c.company_address.toLowerCase().includes(search.toLowerCase())) ||
        (c.company_website && c.company_website.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [companies, search]);

  // Pagination info
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(startIdx + (filteredCompanies?.length || 0) - 1, total);

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handlePage = (p) => setPage(p);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin hapus perusahaan ini?',
      text: 'Tindakan ini tidak dapat dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    setLoading(true);
    setError('');
    try {
      await deleteCompany(id);
      await fetchCompanies(page, limit); // refresh data
      Swal.fire('Terhapus!', 'Perusahaan berhasil dihapus.', 'success');
    } catch (err) {
      Swal.fire('Gagal!', err.message || 'Gagal menghapus perusahaan', 'error');
      setError(err.message || 'Gagal menghapus perusahaan');
    } finally {
      setLoading(false);
    }
  };

  // Ensure filteredCompanies is always an array for rendering
  const companiesToRender = Array.isArray(filteredCompanies) ? filteredCompanies : [];

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
                        Data Perusahaan
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-building me-2"></i>Data Perusahaan
                  </h2>
                </div>
                <Link to="/admin/companies/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i>Tambah Perusahaan</Link>
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
                      <th scope="col">Nama Perusahaan</th>
                      <th scope="col">Email</th>
                      <th scope="col">No. Telepon</th>
                      <th scope="col">Alamat</th>
                      <th scope="col">Website</th>
                      <th scope="col" className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                    ) : error ? (
                      <tr><td colSpan={7} className="text-center text-danger">{error}</td></tr>
                    ) : companiesToRender.length === 0 ? (
                      <tr><td colSpan={7} className="text-center">Data tidak ditemukan</td></tr>
                    ) : (
                      companiesToRender.map((company, idx) => (
                        <tr key={company.company_id}>
                          <td>
                            <img 
                              src={company.company_logo || 'https://via.placeholder.com/40x40'} 
                              className="table-avatar" 
                              alt="Company" 
                              style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                            />
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{company.company_name || '-'}</div>
                              {company.company_description && (
                                <small className="text-muted">{company.company_description.substring(0, 30)}{company.company_description.length > 30 ? '...' : ''}</small>
                              )}
                            </div>
                          </td>
                          <td>{company.email}</td>
                          <td>{formatPhoneNumber(company.company_phone)}</td>
                          <td>
                            <div className="fw-semibold">{company.company_address || '-'}</div>
                          </td>
                          <td>
                            {company.company_website ? (
                              <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                <span className="badge bg-info-subtle text-info" style={{fontWeight:600, fontSize:'0.85em'}}>
                                  <i className="bi bi-link-45deg me-1"></i>Website
                                </span>
                              </a>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="text-end table-actions">
                            <Link to={`/admin/companies/detail/${company.company_id}`} className="btn btn-sm btn-outline-info me-1" title="Detail">
                              <i className="bi bi-eye"></i>
                            </Link>
                            <Link to={`/admin/companies/edit/${company.company_id}`} className="btn btn-sm btn-outline-secondary me-1" title="Edit">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button onClick={() => handleDelete(company.company_id)} className="btn btn-sm btn-outline-danger" title="Hapus">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                  <div>
                    Menampilkan {companiesToRender.length === 0 ? 0 : startIdx} sampai {endIdx} dari {total} entri
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

export default CompanyPage;
