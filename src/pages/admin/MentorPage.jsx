import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getAllMentors, deleteMentor } from '../../apis/adminApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const genderBadge = (gender) => {
  if (gender === 'male') {
    return <span className="badge bg-primary-subtle text-primary" style={{fontWeight:600, fontSize:'0.85em'}}>Laki-laki</span>;
  }
  return <span className="badge bg-pink-subtle text-pink" style={{fontWeight:600, fontSize:'0.85em'}}>Perempuan</span>;
};

const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
};

const MentorPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data
  const fetchMentors = async (page = 1, limit = 5) => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllMentors(page, limit);
      
      // Handle the correct API response structure
      // response.data contains the mentor array directly
      // response.pagination contains pagination info
      const mentorData = Array.isArray(response.data) ? response.data : [];
      
      setMentors(mentorData);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Gagal memuat data mentor');
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

  // Search filter (client-side) - ensure it always returns an array
  const filteredMentors = useMemo(() => {
    // Ensure mentors is always an array
    const mentorArray = Array.isArray(mentors) ? mentors : [];
    
    if (!search) return mentorArray;
    
    return mentorArray.filter(m => {
      if (!m || typeof m !== 'object') return false;
      
      return (
        (m.email && m.email.toLowerCase().includes(search.toLowerCase())) ||
        (m.full_name && m.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (m.position && m.position.toLowerCase().includes(search.toLowerCase())) ||
        (m.phone_number && m.phone_number.includes(search)) ||
        (m.department && m.department.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [mentors, search]);

  // Pagination info
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(startIdx + (filteredMentors?.length || 0) - 1, total);

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handlePage = (p) => setPage(p);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin hapus mentor ini?',
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
      await deleteMentor(id);
      await fetchMentors(page, limit); // refresh data
      Swal.fire('Terhapus!', 'Mentor berhasil dihapus.', 'success');
    } catch (err) {
      Swal.fire('Gagal!', err.message || 'Gagal menghapus mentor', 'error');
      setError(err.message || 'Gagal menghapus mentor');
    } finally {
      setLoading(false);
    }
  };

  // Ensure filteredMentors is always an array for rendering
  const mentorsToRender = Array.isArray(filteredMentors) ? filteredMentors : [];

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
                        Data Mentor
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-people me-2"></i>Data Mentor
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
                      <th scope="col">Photo</th>
                      <th scope="col">Nama Lengkap</th>
                      <th scope="col">Email</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Posisi</th>
                      <th scope="col">Departemen</th>
                      <th scope="col" className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                    ) : error ? (
                      <tr><td colSpan={7} className="text-center text-danger">{error}</td></tr>
                    ) : mentorsToRender.length === 0 ? (
                      <tr><td colSpan={7} className="text-center">Data tidak ditemukan</td></tr>
                    ) : (
                      mentorsToRender.map((mentor, idx) => (
                        <tr key={mentor.id}>
                          <td>
                            <img 
                              src={mentor.photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} 
                              className="table-avatar" 
                              alt="Mentor" 
                              style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                            />
                          </td>
                          <td>
                            <div className="fw-semibold">{mentor.full_name || '-'}</div>
                          </td>
                          <td>{mentor.email}</td>
                          <td>{genderBadge(mentor.gender)}</td>
                          <td>
                            <span className="badge bg-info-subtle text-info" style={{fontWeight:600, fontSize:'0.85em'}}>
                              {mentor.position || '-'}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success" style={{fontWeight:600, fontSize:'0.85em'}}>
                              {mentor.department || '-'}
                            </span>
                          </td>
                          <td className="text-end table-actions">
                            <div className="btn-group" role="group">
                              <Link
                                to={`/admin/mentors/detail/${mentor.mentor_id}`}
                                className="btn btn-sm btn-outline-info me-1"
                                title="Detail"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              <Link
                                to={`/admin/mentors/edit/${mentor.mentor_id}`}
                                className="btn btn-sm btn-outline-secondary me-1"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(mentor.mentor_id)}
                                title="Hapus"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                  <div>
                    Menampilkan {mentorsToRender.length === 0 ? 0 : startIdx} sampai {endIdx} dari {total} entri
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

export default MentorPage;
