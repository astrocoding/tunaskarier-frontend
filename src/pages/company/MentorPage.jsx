import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyFooter from '../../components/company/CompanyFooter';
import { getMentorsCompany, deleteMentor } from '../../apis/companyApi';
import '../../styles/Admin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import Swal from 'sweetalert2';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const genderBadge = (gender) => {
  if (gender === 'male') {
    return <span className="badge bg-primary-subtle text-primary" style={{fontWeight:600, fontSize:'1em'}}>Laki-laki</span>;
  }
  return <span className="badge bg-info-subtle text-info" style={{fontWeight:600, fontSize:'1em'}}>Perempuan</span>;
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
      console.log('Fetching mentors with page:', page, 'limit:', limit);
      
      // Check if token exists
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      const response = await getMentorsCompany(page, limit);
      
      console.log('Full API Response:', response);
      console.log('Response.data:', response.data);
      console.log('Response.pagination:', response.pagination);
      
      const mentorData = Array.isArray(response.data) ? response.data : [];
      
      console.log('Processed mentor data:', mentorData);
      console.log('Mentor data length:', mentorData.length);
      
      setMentors(mentorData);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
      
      localStorage.setItem('mentors', JSON.stringify(mentorData));
    } catch (err) {
      console.error('Error in fetchMentors:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
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

  // Search filter (client-side, karena API tidak support search) - ensure it always returns an array
  const filteredMentors = useMemo(() => {
    // Ensure mentors is always an array
    const mentorArray = Array.isArray(mentors) ? mentors : [];
    
    if (!search) return mentorArray;
    
    return mentorArray.filter(m => {
      if (!m || typeof m !== 'object') return false;
      
      return (
        (m.full_name && m.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (m.position && m.position.toLowerCase().includes(search.toLowerCase())) ||
        (m.department && m.department.toLowerCase().includes(search.toLowerCase())) ||
        (m.phone_number && m.phone_number.includes(search))
      );
    });
  }, [mentors, search]);

  // Pagination info
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(startIdx + (filteredMentors?.length || 0) - 1, total);

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
  
  // Debug logs
  console.log('Current mentors state:', mentors);
  console.log('Filtered mentors:', filteredMentors);
  console.log('Mentors to render:', mentorsToRender);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <CompanyNavbar />
        <div className="container-fluid">
          <div className="row">
            <CompanySidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2" style={{marginTop: '60px'}}>
                <div>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-2">
                      <li className="breadcrumb-item">
                        <Link to="/company" className="text-decoration-none text-muted">
                          Dashboard
                        </Link>
                      </li>
                      <li className="breadcrumb-item active text-primary">
                        Data Mentor
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">Data Mentor</h2>
                </div>
                <Link to="/company/mentors/create" className="btn btn-primary"><i className="bi bi-plus-lg"></i>Tambah</Link>
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
                      <th scope="col">Nama Lengkap</th>
                      <th scope="col">Posisi</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Department</th>
                      <th scope="col">No. HP</th>
                      <th scope="col" className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
                    ) : error ? (
                      <tr><td colSpan={6} className="text-center text-danger">{error}</td></tr>
                    ) : mentorsToRender.length === 0 ? (
                      <tr><td colSpan={6} className="text-center">Data tidak ditemukan</td></tr>
                    ) : (
                      mentorsToRender.map((mentor, idx) => (
                        <tr key={mentor?.id || idx}>
                          <td>{mentor?.full_name || '-'}</td>
                          <td>{mentor?.position || '-'}</td>
                          <td>{mentor?.gender ? genderBadge(mentor.gender) : '-'}</td>
                          <td>{mentor?.department || '-'}</td>
                          <td>{mentor?.phone_number || '-'}</td>
                          <td className="text-end table-actions">
                            <Link to={`/company/mentors/edit/${mentor?.mentor_id}`} className="btn btn-sm btn-outline-secondary me-1">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button onClick={() => handleDelete(mentor?.mentor_id)} className="btn btn-sm btn-outline-danger">
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
        <CompanyFooter />
      </div>
    </SidebarProvider>
  );
};

export default MentorPage;
