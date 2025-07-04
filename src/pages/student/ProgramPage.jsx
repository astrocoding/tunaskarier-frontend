import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StudentNavbar from '../../components/student/StudentNavbar';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentFooter from '../../components/student/StudentFooter';
import ProgramCard from '../../components/ProgramCard';
import { getAvailablePrograms, searchAvailablePrograms } from '../../apis/studentApi';

const ProgramPage = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const programsPerPage = 6;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Baru saja';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 hari yang lalu';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
    
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch all programs (default)
  const fetchPrograms = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAvailablePrograms(page, programsPerPage);
      
      setPrograms(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalPrograms(response.pagination?.total || 0);
      setCurrentPage(page);
    } catch (err) {
      setError('Gagal memuat program. Silakan coba lagi.');
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search programs with debouncing
  const searchPrograms = useCallback(async (searchTerm, page = 1) => {
    if (!searchTerm.trim()) {
      await fetchPrograms(page);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      
      const response = await searchAvailablePrograms(searchTerm, page, programsPerPage);
      
      setPrograms(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalPrograms(response.pagination?.total || 0);
      setCurrentPage(page);
    } catch (err) {
      setError('Gagal mencari program. Silakan coba lagi.');
      console.error('Error searching programs:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchPrograms(searchTerm, 1);
      } else {
        fetchPrograms(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchPrograms]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (searchTerm.trim()) {
      searchPrograms(searchTerm, page);
    } else {
      fetchPrograms(page);
    }
  };

  // Handle apply to program
  const handleApplyToProgram = (programId) => {
    navigate(`/student/programs/${programId}`);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    fetchPrograms(1);
  };

  // Initial load
  useEffect(() => {
    fetchPrograms();
  }, []);

  // Transform program data for ProgramCard (avoid double intern_type)
  const transformProgram = (program) => {
    // Debug: Log program data to see structure
    console.log('Program data:', program);
    
    // Only add intern_type to tags if not already present
    const tags = [program.category].filter(Boolean);
    // duration and workType are shown as badges, not tags
    return {
      id: program.id,
      companyLogo: program.photo,
      companyName: program.company_name,
      position: program.title,
      location: program.location,
      positions: program.quota,
      tags,
      duration: program.duration,
      workType: program.intern_type,
      createdAt: formatDate(program.created_at),
      alreadyApplied: program.already_applied || false
    };
  };

  return (
    <div style={{background: '#f7fafd', minHeight: '100vh'}}>
      <StudentNavbar />
      <div className="container-fluid">
        <div className="row">
          <StudentSidebar />
          <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-2">
                    <li className="breadcrumb-item"><Link to="/student" className="text-decoration-none">Dashboard</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Program Tersedia</li>
                  </ol>
                </nav>
                <h2 className="fw-bold text-primary mb-0">Program Tersedia</h2>
              </div>
            </div>
            <p className="text-muted mb-4">Temukan program yang sesuai dengan minat dan kemampuanmu</p>
            {/* Search Bar */}
            <div className="row mb-4">
              <div className="col-12 col-lg-8 col-xl-7">
                <div className="search-input-wrapper position-relative">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-lg border-end-0 search-input-custom"
                      placeholder="Cari program berdasarkan posisi, perusahaan, atau lokasi..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      style={{ borderRadius: '50px 0 0 50px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-lg"
                      style={{ borderRadius: '0 50px 50px 0' }}
                      disabled={loading || isSearching}
                    >
                      {isSearching ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Searching...</span>
                        </div>
                      ) : (
                        <i className="bi bi-search"></i>
                      )}
                    </button>
                  </div>
                  {searchTerm && (
                    <button
                      className="btn btn-sm position-absolute"
                      style={{ right: '60px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                      onClick={handleClearSearch}
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Results Info */}
            <div className="mb-3">
              <span className="text-muted">{loading ? 'Memuat...' : `${totalPrograms} program ditersedia`}</span>
            </div>
            {/* Error Message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}
            {/* Programs Grid */}
            <div className="row g-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0 p-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="bg-light rounded" style={{ width: '36px', height: '36px' }}></div>
                        <div className="bg-light rounded ms-2" style={{ width: '100px', height: '16px' }}></div>
                      </div>
                      <div className="bg-light rounded mb-1" style={{ width: '80%', height: '24px' }}></div>
                      <div className="bg-light rounded mb-2" style={{ width: '60%', height: '16px' }}></div>
                      <div className="bg-light rounded mb-3" style={{ width: '40%', height: '16px' }}></div>
                      <div className="d-flex gap-2 mb-3">
                        <div className="bg-light rounded" style={{ width: '60px', height: '24px' }}></div>
                        <div className="bg-light rounded" style={{ width: '80px', height: '24px' }}></div>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="bg-light rounded" style={{ width: '100px', height: '20px' }}></div>
                        <div className="bg-light rounded" style={{ width: '80px', height: '32px' }}></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : programs.length > 0 ? (
                programs.map((program) => (
                  <ProgramCard
                    key={program?.id || 'unknown'}
                    {...transformProgram(program)}
                    showApplyButton={true}
                    onApplyClick={handleApplyToProgram}
                    userRole="student"
                    alreadyApplied={program?.already_applied || false}
                  />
                ))
              ) : (
                <div className="col-12">
                  <div className="text-center py-5">
                    <i className="bi bi-search display-1 text-muted mb-3"></i>
                    <h4 className="text-muted mb-2">Tidak ada program ditemukan</h4>
                    <p className="text-muted mb-0">
                      {searchTerm 
                        ? 'Coba ubah kata kunci pencarian Anda'
                        : 'Belum ada program yang tersedia saat ini'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                  Menampilkan {(currentPage - 1) * programsPerPage + 1} - {Math.min(currentPage * programsPerPage, totalPrograms)} dari {totalPrograms} program
                </div>
                <nav aria-label="Program pagination">
                  <ul className="pagination mb-0">
                    {/* Previous button */}
                    <li className="page-item">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handlePageChange(currentPage - 1)}
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
                          onClick={() => handlePageChange(number)}
                        >
                          {number}
                        </button>
                      </li>
                    ))}
                    {/* Next button */}
                    <li className="page-item">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
      <StudentFooter />
    </div>
  );
};

export default ProgramPage;

