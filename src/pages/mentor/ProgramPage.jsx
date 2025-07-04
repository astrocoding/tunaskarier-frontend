import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorNavbar from '../../components/mentor/MentorNavbar';
import MentorSidebar from '../../components/mentor/MentorSidebar';
import MentorFooter from '../../components/mentor/MentorFooter';
import ProgramCard from '../../components/ProgramCard';
import { getMentorPrograms } from '../../apis/mentorApi';
import '../../styles/DashboardAdmin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';

const ProgramPage = () => {
  const [mentorPrograms, setMentorPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [programsPerPage] = useState(6);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  // Fetch program data from API
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getMentorPrograms(currentPage, programsPerPage);
        
        // Handle the correct API response structure
        // response.data contains the program array directly
        // response.pagination contains pagination info
        const programsData = Array.isArray(response.data) ? response.data : [];
        
        if (programsData.length > 0) {
          const transformedPrograms = programsData.map(program => ({
            id: program.id,
            companyLogo: program.photo || 'https://via.placeholder.com/36x36?text=Logo',
            companyName: program.company_name,
            position: program.title,
            location: program.location,
            positions: program.quota,
            tags: program.category ? [program.category] : [],
            duration: program.duration,
            workType: program.intern_type,
            createdAt: formatCreatedAt(program.created_at)
          }));
          setMentorPrograms(transformedPrograms);
        } else {
          setMentorPrograms([]);
        }
        
        // Set pagination data
        setPagination(response.pagination || {});
      } catch (err) {
        setError(err.message || 'Gagal memuat data program');
        setMentorPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [currentPage]);

  // Helper function to format created_at date
  const formatCreatedAt = (dateString) => {
    if (!dateString) return 'Baru saja';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 hari yang lalu';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    return `${Math.floor(diffDays / 30)} bulan yang lalu`;
  };

  // Pagination logic
  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = mentorPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
  const totalPages = pagination.totalPages || Math.ceil(mentorPrograms.length / programsPerPage);

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

  const handleProgramClick = (programId) => {
    navigate(`/mentor/programs/${programId}`);
  };

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <MentorNavbar />
        <div className="container-fluid">
          <div className="row">
            <MentorSidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{ marginTop: '60px', marginBottom: '100px'}}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item"><a href="/mentor" className="text-decoration-none">Dashboard</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Program Saya</li>
                </ol>
              </nav>
              {/* Program Cards Section */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-primary">Program Saya</h3>
                  <div className="text-muted">
                    Total: {pagination?.total || mentorPrograms.length} program
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Memuat data program...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                ) : mentorPrograms.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-journal-x fs-1 text-muted"></i>
                    <p className="mt-2 text-muted">Belum ada program yang ditugaskan</p>
                    <p className="text-muted small">Program akan muncul di sini setelah perusahaan menugaskan program kepada Anda</p>
                  </div>
                ) : (
                  <>
                    <div className="row g-4">
                      {currentPrograms.map((program) => (
                        <ProgramCard
                          key={program?.id || 'unknown'}
                          id={program?.id}
                          companyLogo={program?.companyLogo}
                          companyName={program?.companyName}
                          position={program?.position}
                          location={program?.location}
                          positions={program?.positions}
                          tags={program?.tags}
                          duration={program?.duration}
                          workType={program?.workType}
                          createdAt={program?.createdAt}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted">
                          Menampilkan {indexOfFirstProgram + 1} - {Math.min(indexOfLastProgram, mentorPrograms.length)} dari {pagination?.total || mentorPrograms.length} program
                        </div>
                        <nav aria-label="Program pagination">
                          <ul className="pagination mb-0">
                            {/* Previous button */}
                            <li className="page-item">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                              >
                                <i className="bi bi-chevron-left"></i>
                              </button>
                            </li>
                            {/* Page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                              <li key={number} className="page-item">
                                <button
                                  className={`btn btn-sm ${currentPage === number ? 'btn-primary' : 'btn-outline-primary'}`}
                                  onClick={() => paginate(number)}
                                >
                                  {number}
                                </button>
                              </li>
                            ))}
                            {/* Next button */}
                            <li className="page-item">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                              >
                                <i className="bi bi-chevron-right"></i>
                              </button>
                            </li>
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

export default ProgramPage;
