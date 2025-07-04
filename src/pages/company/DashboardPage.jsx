import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyFooter from '../../components/company/CompanyFooter';
import ProgramCard from '../../components/ProgramCard';
import { getPrograms } from '../../apis/companyApi';
import '../../styles/DashboardAdmin.css';
import { SidebarProvider } from '../../contexts/SidebarContext.jsx';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [companyPrograms, setCompanyPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [programsPerPage] = useState(6);
  const navigate = useNavigate();

  // Fetch program data from API
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getPrograms();
        console.log('Dashboard Response:', response);
        
        // Handle the correct API response structure
        // response.data contains the program array directly
        // response.pagination contains pagination info
        let programsData = [];
        if (response.data && Array.isArray(response.data)) {
          programsData = response.data;
        } else if (response && Array.isArray(response)) {
          programsData = response;
        }
        
        console.log('Programs Data:', programsData);
        
        if (programsData.length > 0) {
          const transformedPrograms = programsData.map(program => ({
            id: program?.id || 'unknown',
            companyLogo: program?.photo || 'https://via.placeholder.com/36x36?text=Logo',
            companyName: program?.company_name || '-',
            position: program?.title || '-',
            location: program?.location || '-',
            positions: program?.quota || 0,
            tags: program?.category ? [program.category] : [],
            duration: program?.duration || '-',
            workType: program?.intern_type || '-',
            createdAt: formatCreatedAt(program?.created_at)
          }));
          setCompanyPrograms(transformedPrograms);
        } else {
          setCompanyPrograms([]);
        }
      } catch (err) {
        console.error('Error in fetchPrograms:', err);
        setError(err.message || 'Gagal memuat data program');
        // Fallback to sample data if API fails
        setCompanyPrograms([
          {
            id: "program-8iPo6JAAAJeEE_-i",
            companyLogo: 'https://via.placeholder.com/36x36?text=Logo',
            companyName: 'PT. Test Solutions',
            title: 'Program Magang Software Developer',
            location: 'Jakarta',
            quota: 10,
            tags: ['Software Development'],
            duration: '3 bulan',
            workType: 'Hybrid',
            createdAt: '1 hari yang lalu'
          },
          {
            id: "program-9kQp7KBBBKfFF_-j",
            companyLogo: 'https://via.placeholder.com/36x36?text=Logo',
            companyName: 'PT. Test Solutions',
            title: 'Program Magang Data Analyst',
            location: 'Bandung',
            quota: 5,
            tags: ['Data Science', 'Analytics'],
            duration: '6 bulan',
            workType: 'Remote',
            createdAt: '3 hari yang lalu'
          },
          {
            id: "program-10lRq8LCCCLgGG_-k",
            companyLogo: 'https://via.placeholder.com/36x36?text=Logo',
            companyName: 'PT. Test Solutions',
            title: 'Program Magang UI/UX Designer',
            location: 'Surabaya',
            quota: 3,
            tags: ['Design', 'UI/UX'],
            duration: '4 bulan',
            workType: 'On-site',
            createdAt: '5 hari yang lalu'
          },
          {
            id: "program-11mSr9MDDDMhHH_-l",
            companyLogo: 'https://via.placeholder.com/36x36?text=Logo',
            companyName: 'PT. Test Solutions',
            title: 'Program Magang Mobile Developer',
            location: 'Yogyakarta',
            quota: 8,
            tags: ['Mobile Development'],
            duration: '5 bulan',
            workType: 'Hybrid',
            createdAt: '1 minggu yang lalu'
          },
          {
            id: "program-12nTs0NEEENiII_-m",
            companyLogo: 'https://via.placeholder.com/36x36?text=Logo',
            companyName: 'PT. Test Solutions',
            title: 'Program Magang DevOps Engineer',
            location: 'Jakarta',
            quota: 4,
            tags: ['DevOps', 'Infrastructure'],
            duration: '6 bulan',
            workType: 'Remote',
            createdAt: '1 minggu yang lalu'
          },
          {
            id: "program-13oTt1OFFFOjJJ_-n",
            companyLogo: 'https://via.placeholder.com/36x36?text=Logo',
            companyName: 'PT. Test Solutions',
            title: 'Program Magang Product Manager',
            location: 'Bandung',
            quota: 2,
            tags: ['Product Management'],
            duration: '8 bulan',
            workType: 'On-site',
            createdAt: '2 minggu yang lalu'
          },
          {
            id: "program-14pUu2PGGGPkKK_-o",
            companyLogo: 'https://via.placeholder.com/36x36?text=Logo',
            companyName: 'PT. Test Solutions',
            title: 'Program Magang QA Engineer',
            location: 'Surabaya',
            quota: 6,
            tags: ['Quality Assurance'],
            duration: '4 bulan',
            workType: 'Hybrid',
            createdAt: '2 minggu yang lalu'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

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
  const currentPrograms = companyPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
  const totalPages = Math.ceil(companyPrograms.length / programsPerPage);

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
    console.log(`Program ${programId} clicked`);
    navigate(`/company/programs/${programId}`);
  };

  return (
    <SidebarProvider>
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <CompanyNavbar />
        <div className="container-fluid">
          <div className="row">
            <CompanySidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{ marginBottom: '100px'}}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2" style={{marginTop: '60px'}}>
                <div>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-2">
                      <li className="breadcrumb-item active text-primary">
                        Dashboard
                      </li>
                    </ol>
                  </nav>
                  <h2 className="fw-bold text-primary mb-0">Program Terbaru</h2>
                </div>
                <a href="/company/programs/create" className="btn btn-outline-primary">
                  <i className="bi bi-plus me-1"></i>Tambah
                </a>
              </div>
              {/* Program Cards Section */}
              <div className="">
                
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
                ) : companyPrograms.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-journal-x fs-1 text-muted"></i>
                    <p className="mt-2 text-muted">Belum ada program yang dibuat</p>
                    <a href="/company/programs/create" className="btn btn-primary">
                      <i className="bi bi-plus me-1"></i>Buat Program Pertama
                    </a>
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
                          onClick={() => handleProgramClick(program?.id)}
                          showDetailButton={true}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted">
                          Menampilkan {indexOfFirstProgram + 1} - {Math.min(indexOfLastProgram, companyPrograms.length)} dari {companyPrograms.length} program
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
        <CompanyFooter />
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage; 