import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MentorNavbar from '../../components/mentor/MentorNavbar';
import MentorSidebar from '../../components/mentor/MentorSidebar';
import MentorFooter from '../../components/mentor/MentorFooter';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import { getAssessments, deleteAssessment } from '../../apis/mentorApi';
import Swal from 'sweetalert2';
import '../../styles/DashboardAdmin.css';

const AssessmentPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

  // Fetch data
  const fetchAssessments = async (page = 1, limit = 10) => {
    setLoading(true);
    setError('');
    try {
      const response = await getAssessments(page, limit);
      
      const assessmentsData = Array.isArray(response.data) ? response.data : [];
      
      setAssessments(assessmentsData);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Gagal memuat data assessment');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments(page, limit);
  }, [page, limit]);

  // Search filter (client-side)
  const filteredAssessments = React.useMemo(() => {
    const assessmentArray = Array.isArray(assessments) ? assessments : [];
    
    if (!search) return assessmentArray;
    
    return assessmentArray.filter(assessment => {
      if (!assessment || typeof assessment !== 'object') return false;
      
      return (
        (assessment.student_name && assessment.student_name.toLowerCase().includes(search.toLowerCase())) ||
        (assessment.student_nis && assessment.student_nis.toLowerCase().includes(search.toLowerCase())) ||
        (assessment.program_title && assessment.program_title.toLowerCase().includes(search.toLowerCase())) ||
        (assessment.mentor_name && assessment.mentor_name.toLowerCase().includes(search.toLowerCase())) ||
        (assessment.final_grade && assessment.final_grade.toString().includes(search))
      );
    });
  }, [assessments, search]);

  // Pagination info
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(startIdx + (filteredAssessments?.length || 0) - 1, total);

  // Pagination controls
  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handlePage = (p) => setPage(p);

  // Handle delete assessment
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin hapus assessment ini?',
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
      await deleteAssessment(id);
      await fetchAssessments(page, limit); // refresh data
      Swal.fire('Terhapus!', 'Assessment berhasil dihapus.', 'success');
    } catch (err) {
      Swal.fire('Gagal!', err.message || 'Gagal menghapus assessment', 'error');
      setError(err.message || 'Gagal menghapus assessment');
    } finally {
      setLoading(false);
    }
  };

  // Get grade badge color
  const getGradeBadge = (grade) => {
    if (grade >= 90) {
      return <span className="badge bg-success text-white px-2 py-1">A ({grade})</span>;
    } else if (grade >= 80) {
      return <span className="badge bg-primary text-white px-2 py-1">B ({grade})</span>;
    } else if (grade >= 70) {
      return <span className="badge bg-warning text-dark px-2 py-1">C ({grade})</span>;
    } else if (grade >= 60) {
      return <span className="badge bg-info text-white px-2 py-1">D ({grade})</span>;
    } else {
      return <span className="badge bg-danger text-white px-2 py-1">E ({grade})</span>;
    }
  };

  // Ensure filteredAssessments is always an array for rendering
  const assessmentsToRender = Array.isArray(filteredAssessments) ? filteredAssessments : [];

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <MentorNavbar />
        <div className="container-fluid">
          <div className="row">
            <MentorSidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item"><a href="/mentor" className="text-decoration-none">Dashboard</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Assessment</li>
                </ol>
              </nav>
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2 className="fw-bold text-primary mb-0">Data Assessment</h2>
              </div>
              
              <div className="table-responsive rounded-4 shadow-sm bg-white p-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <label className="me-2 mb-0">Tampilkan</label>
                    <select 
                      className="form-select form-select-sm" 
                      style={{width: '70px'}} 
                      value={limit} 
                      onChange={e => {setLimit(Number(e.target.value)); setPage(1);}}
                    >
                      {PAGE_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <span className="ms-2">entri</span>
                  </div>
                  <div>
                    <label className="me-2 mb-0">Cari:</label>
                    <input 
                      type="search" 
                      className="form-control form-control-sm d-inline-block" 
                      style={{width: '180px'}} 
                      value={search} 
                      onChange={e => setSearch(e.target.value)} 
                      placeholder="Cari..." 
                    />
                  </div>
                </div>
                
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Nama Siswa</th>
                      <th scope="col">NIS</th>
                      <th scope="col">Program</th>
                      <th scope="col">Mentor</th>
                      <th scope="col">Nilai Akhir</th>
                      <th scope="col" className="text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={6} className="text-center text-danger">{error}</td>
                      </tr>
                    ) : assessmentsToRender.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center">Data tidak ditemukan</td>
                      </tr>
                    ) : (
                      assessmentsToRender.map((assessment, idx) => (
                        <tr key={assessment?.id || idx}>
                          <td>
                            <div className="fw-semibold">{assessment?.student_name || '-'}</div>
                          </td>
                          <td>
                            <span className="text-primary fw-semibold">{assessment?.student_nis || '-'}</span>
                          </td>
                          <td>
                            <div className="fw-semibold">{assessment?.program_title || '-'}</div>
                            <small className="text-muted">{assessment?.company_name || '-'}</small>
                          </td>
                          <td>
                            <div className="fw-semibold">{assessment?.mentor_name || '-'}</div>
                          </td>
                          <td>
                            {assessment?.final_grade ? getGradeBadge(assessment.final_grade) : '-'}
                          </td>
                          <td className="text-end table-actions">
                            <Link 
                              to={`/mentor/assessments/detail/${assessment?.id}`} 
                              className="btn btn-sm btn-outline-info me-1" 
                              title="Detail"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                            <button 
                              onClick={() => handleDelete(assessment?.id)} 
                              className="btn btn-sm btn-outline-danger" 
                              title="Hapus"
                            >
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
                    Menampilkan {assessmentsToRender.length === 0 ? 0 : startIdx} sampai {endIdx} dari {total} entri
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                        <button className="page-link" onClick={handlePrev} disabled={page === 1}>
                          Sebelumnya
                        </button>
                      </li>
                      {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                        <li key={p} className={`page-item${p === page ? ' active' : ''}`}>
                          <button className="page-link" onClick={() => handlePage(p)}>{p}</button>
                        </li>
                      ))}
                      <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
                        <button className="page-link" onClick={handleNext} disabled={page === totalPages}>
                          Berikutnya
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </main>
          </div>
        </div>
        <MentorFooter />
      </div>
    </SidebarProvider>
  );
};

export default AssessmentPage;
