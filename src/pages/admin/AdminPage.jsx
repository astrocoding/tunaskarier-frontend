import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getAllAdmins, deleteAdmin } from '../../apis/adminApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const roleBadge = (role) => {
  if (role === 'superadmin') {
    return <span className="badge bg-primary-subtle text-primary" style={{fontWeight:600, fontSize:'1em'}}>superadmin</span>;
  }
  return <span className="badge bg-info-subtle text-info" style={{fontWeight:600, fontSize:'1em'}}>admin</span>;
};

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAdmins(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

  // Fetch data
  const fetchAdmins = async (page = 1, limit = 5) => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllAdmins(page, limit);
      
      // Handle the correct API response structure
      // response.data contains the admin array directly
      // response.pagination contains pagination info
      const adminData = Array.isArray(response.data) ? response.data : [];
      
      setAdmins(adminData);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Gagal memuat data admin');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  // Search filter (client-side)
  const filteredAdmins = useMemo(() => {
    // Ensure admins is always an array
    const adminArray = Array.isArray(admins) ? admins : [];
    
    if (!search) return adminArray;
    
    return adminArray.filter(a => {
      if (!a || typeof a !== 'object') return false;
      
      return (
        (a.email && a.email.toLowerCase().includes(search.toLowerCase())) ||
        (a.full_name && a.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (a.phone_number && a.phone_number.includes(search))
      );
    });
  }, [admins, search]);

  // Pagination info
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(startIdx + (filteredAdmins?.length || 0) - 1, total);

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handlePage = (p) => setPage(p);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin hapus admin ini?',
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
      await deleteAdmin(id);
      await fetchAdmins(page, limit); // refresh data
      Swal.fire('Terhapus!', 'Admin berhasil dihapus.', 'success');
    } catch (err) {
      Swal.fire('Gagal!', err.message || 'Gagal menghapus admin', 'error');
      setError(err.message || 'Gagal menghapus admin');
    } finally {
      setLoading(false);
    }
  };

  // Ensure filteredAdmins is always an array for rendering
  const adminsToRender = Array.isArray(filteredAdmins) ? filteredAdmins : [];

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
                        Data Admin
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-shield-lock me-2"></i>Data Admin
                  </h2>
                </div>
                <Link to="/admin/admins/create" className="btn btn-primary">
                  <i className="bi bi-plus-lg me-1"></i>Tambah Admin
                </Link>
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
                      <th scope="col">Photo</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">Nama Lengkap</th>
                      <th scope="col">No. HP</th>
                      <th scope="col" className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                    ) : error ? (
                      <tr><td colSpan={6} className="text-center text-danger">{error}</td></tr>
                    ) : adminsToRender.length === 0 ? (
                      <tr><td colSpan={6} className="text-center">Data tidak ditemukan</td></tr>
                    ) : (
                      adminsToRender.map((admin, idx) => (
                        <tr key={admin?.id || idx}>
                          <td><img src={admin?.photo || 'https://via.placeholder.com/40x40'} className="table-avatar" alt="Admin" /></td>
                          <td>{admin?.email || '-'}</td>
                          <td>{roleBadge(admin?.role || 'admin')}</td>
                          <td>{admin?.full_name || '-'}</td>
                          <td>{admin?.phone_number || '-'}</td>
                          <td className="text-end table-actions">
                            <Link to={`/admin/admins/edit/${admin?.id}`} className="btn btn-sm btn-outline-secondary me-1">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button onClick={() => handleDelete(admin?.id)} className="btn btn-sm btn-outline-danger">
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
                    Menampilkan {adminsToRender.length === 0 ? 0 : startIdx} sampai {endIdx} dari {total} entri
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

export default AdminPage;
