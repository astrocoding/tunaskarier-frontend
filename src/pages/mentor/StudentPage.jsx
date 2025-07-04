import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorNavbar from '../../components/mentor/MentorNavbar';
import MentorSidebar from '../../components/mentor/MentorSidebar';
import MentorFooter from '../../components/mentor/MentorFooter';
import { getMentorStudents } from '../../apis/mentorApi';
import '../../styles/DashboardAdmin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(6);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch data
  const fetchStudents = async (page = 1, limit = 6) => {
    setLoading(true);
    setError('');
    try {
      const response = await getMentorStudents(page, limit);
      
      const studentsData = Array.isArray(response.data) ? response.data : [];
      
      setStudents(studentsData);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Gagal memuat data siswa');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStudents(currentPage, studentsPerPage);
  }, [currentPage]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get gender text
  const getGenderText = (gender) => {
    return gender === 'male' ? 'Laki-laki' : 'Perempuan';
  };

  // Helper function to calculate age
  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} tahun`;
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="btn btn-outline-primary btn-sm"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="btn btn-outline-primary btn-sm"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      );
    }

    return pages;
  };

  const handleStudentClick = (studentId) => {
    navigate(`/mentor/students/detail/${studentId}`);
  };

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <MentorNavbar />
        <div className="container-fluid">
          <div className="row">
            <MentorSidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{ marginBottom: '100px'}}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item"><a href="/mentor" className="text-decoration-none">Dashboard</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Siswa Saya</li>
                </ol>
              </nav>
              {/* Students Cards Section */}
              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-primary mt-3">Siswa Saya</h3>
                  <div className="text-muted">
                    Total: {total} siswa
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Memuat data siswa...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-people fs-1 text-muted"></i>
                    <p className="mt-2 text-muted">Belum ada siswa yang ditugaskan</p>
                    <p className="text-muted small">Siswa akan muncul di sini setelah mendaftar ke program yang Anda kelola</p>
                  </div>
                ) : (
                  <>
                    <div className="row g-4">
                      {students.map((student) => (
                        <div key={student?.id || 'unknown'} className="col-12 col-md-6 col-lg-4">
                          <div className="card h-100 border-0 shadow-sm" 
                               style={{ 
                                 borderRadius: '12px',
                                 transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                 background: '#ffffff'
                               }}
                               onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-4px)';
                                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                               }}
                               onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                               }}>
                            
                            <div className="card-body p-4">
                              {/* Student Photo and Name */}
                              <div className="text-center mb-4">
                                <div className="position-relative d-inline-block mb-3">
                                  <img 
                                    src={student?.photo || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'} 
                                    alt={`Foto ${student?.full_name || 'Student'}`}
                                    className="rounded-circle"
                                    style={{ 
                                      width: '80px', 
                                      height: '80px', 
                                      objectFit: 'cover',
                                      border: '3px solid #f8f9fa'
                                    }}
                                  />
                                  <div className="position-absolute bottom-0 end-0"
                                      style={{
                                        width: '16px',
                                        height: '16px',
                                        background: '#28a745',
                                        borderRadius: '50%',
                                        border: '2px solid #fff'
                                      }}>
                                  </div>
                                </div>
                                
                                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '1rem' }}>
                                  {student?.full_name || '-'}
                                </h6>
                                
                                <span className="badge bg-light text-secondary px-3 py-1" 
                                      style={{ 
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        borderRadius: '6px'
                                      }}>
                                  {student?.nis || '-'}
                                </span>
                              </div>

                              {/* Student Info */}
                              <div className="space-y-3">
                                <div className="d-flex align-items-center p-2 rounded" 
                                    style={{ background: '#f8f9fa' }}>
                                  <i className="bi bi-mortarboard text-primary me-3" 
                                    style={{ fontSize: '1rem' }}></i>
                                  <div>
                                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                                      Kelas
                                    </small>
                                    <span className="fw-medium text-dark" style={{ fontSize: '0.85rem' }}>
                                      {student?.class || '-'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="d-flex align-items-center p-2 rounded" 
                                    style={{ background: '#f8f9fa' }}>
                                  <i className="bi bi-building text-primary me-3" 
                                    style={{ fontSize: '1rem' }}></i>
                                  <div>
                                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                                      Sekolah
                                    </small>
                                    <span className="fw-medium text-dark" style={{ fontSize: '0.85rem' }}>
                                      {student?.school_name || '-'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Detail Button */}
                              <div className="mt-4">
                                <button 
                                  className="btn btn-primary w-100"
                                  style={{
                                    borderRadius: '8px',
                                    padding: '10px 16px',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    border: 'none',
                                    background: '#5ac1f4',
                                    transition: 'background-color 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#4ab3e5';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#5ac1f4';
                                  }}
                                  onClick={() => handleStudentClick(student?.student_id)}
                                >
                                  <i className="bi bi-eye me-2"></i>
                                  Lihat Detail
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted">
                          Menampilkan {indexOfFirstStudent + 1} - {Math.min(indexOfLastStudent, total)} dari {total} siswa
                        </div>
                        <nav aria-label="Students pagination">
                          <ul className="pagination mb-0">
                            {renderPagination().map((button, index) => (
                              <li key={index} className="page-item">{button}</li>
                            ))}
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
        <MentorFooter />
      </div>
    </SidebarProvider>
  );
};

export default StudentPage;
