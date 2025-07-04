import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { getAllStudents, deleteStudent } from '../../apis/adminApi';
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

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
};

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data
  const fetchStudents = async (page = 1, limit = 5) => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllStudents(page, limit);

      const studentData = Array.isArray(response.data) ? response.data : [];
      
      setStudents(studentData);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Gagal memuat data siswa');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

  const filteredStudents = useMemo(() => {
    const studentArray = Array.isArray(students) ? students : [];
    
    if (!search) return studentArray;
    
    return studentArray.filter(s => {
      if (!s || typeof s !== 'object') return false;
      
      return (
        (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
        (s.full_name && s.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (s.nis && s.nis.toLowerCase().includes(search.toLowerCase())) ||
        (s.phone_number && s.phone_number.includes(search)) ||
        (s.school_name && s.school_name.toLowerCase().includes(search.toLowerCase())) ||
        (s.class && s.class.toLowerCase().includes(search.toLowerCase())) ||
        (s.major && s.major.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [students, search]);

  // Pagination info
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(startIdx + (filteredStudents?.length || 0) - 1, total);

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handlePage = (p) => setPage(p);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin hapus siswa ini?',
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
      await deleteStudent(id);
      await fetchStudents(page, limit);
      Swal.fire('Terhapus!', 'Siswa berhasil dihapus.', 'success');
    } catch (err) {
      Swal.fire('Gagal!', err.message || 'Gagal menghapus siswa', 'error');
      setError(err.message || 'Gagal menghapus siswa');
    } finally {
      setLoading(false);
    }
  };

  const studentsToRender = Array.isArray(filteredStudents) ? filteredStudents : [];

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
                        Data Siswa
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">
                    Data Siswa
                  </h2>
                </div>
                <Link to="/admin/students/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i>Tambah Siswa</Link>
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
                      <th scope="col">NIS</th>
                      <th scope="col">Nama Lengkap</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Tanggal Lahir</th>
                      <th scope="col">Sekolah</th>
                      <th scope="col">Kelas</th>
                      <th scope="col">Jurusan</th>
                      <th scope="col" className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={9} className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                    ) : error ? (
                      <tr><td colSpan={9} className="text-center text-danger">{error}</td></tr>
                    ) : studentsToRender.length === 0 ? (
                      <tr><td colSpan={9} className="text-center">Data tidak ditemukan</td></tr>
                    ) : (
                      studentsToRender.map((student, idx) => (
                        <tr key={student?.id || idx}>
                          <td>
                            <img 
                              src={student?.photo || 'https://via.placeholder.com/40x40'} 
                              className="table-avatar" 
                              alt="Student" 
                              style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                            />
                          </td>
                          <td>
                            <span className="fw-semibold text-primary">{student?.nis || '-'}</span>
                          </td>
                          <td>
                            <div className="fw-semibold">{student?.full_name || '-'}</div>
                          </td>
                          <td>{genderBadge(student?.gender)}</td>
                          <td>{formatDate(student?.birth_date)}</td>
                          <td>
                            <div className="fw-semibold">{student?.school_name || '-'}</div>
                          </td>
                          <td>
                            <span className="badge bg-info-subtle text-info" style={{fontWeight:600, fontSize:'0.85em'}}>
                              {student?.class || '-'}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success" style={{fontWeight:600, fontSize:'0.85em'}}>
                              {student?.major || '-'}
                            </span>
                          </td>
                          <td className="text-end table-actions">
                            <Link to={`/admin/students/detail/${student?.id}`} className="btn btn-sm btn-outline-info me-1" title="Detail">
                              <i className="bi bi-eye"></i>
                            </Link>
                            <Link to={`/admin/students/edit/${student?.id}`} className="btn btn-sm btn-outline-secondary me-1" title="Edit">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button onClick={() => handleDelete(student?.id)} className="btn btn-sm btn-outline-danger" title="Hapus">
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
                    Menampilkan {studentsToRender.length === 0 ? 0 : startIdx} sampai {endIdx} dari {total} entri
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

export default StudentPage;
