import React, { useState, useEffect } from 'react';
import { getAssessments } from '../../apis/studentApi';
import StudentNavbar from '../../components/student/StudentNavbar';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentFooter from '../../components/student/StudentFooter';
import { useNavigate, Link } from 'react-router-dom';

const AssessmentPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, [currentPage]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const response = await getAssessments(currentPage, 6);
      
      console.log('Assessments API Response:', response); // Debug log
      
      setAssessments(response.data || []);
      setPagination(response.pagination || {});
      setError(null);
    } catch (err) {
      setError('Gagal memuat data assessment');
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'finished': { class: 'bg-success', text: 'Selesai', icon: 'fas fa-check-circle' },
      'withdraw': { class: 'bg-warning', text: 'Ditarik', icon: 'fas fa-times-circle' },
      'not_started': { class: 'bg-secondary', text: 'Belum Dimulai', icon: 'fas fa-clock' }
    };

    const config = statusConfig[status] || { class: 'bg-secondary', text: status, icon: 'fas fa-question-circle' };
    
    return (
      <span className={`badge ${config.class} text-white px-3 py-2`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDetailClick = (assessmentId) => {
    navigate(`/student/assessments/detail/${assessmentId}`);
  };

  const handlePrintCertificate = (assessment) => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const getPredikat = (grade) => {
      if (grade >= 86 && grade <= 100) {
        return 'SANGAT MEMUASKAN';
      } else if (grade >= 76 && grade <= 85) {
        return 'MEMUASKAN';
      } else if (grade >= 60 && grade <= 75) {
        return 'CUKUP';
      } else if (grade < 60) {
        return 'KURANG';
      }
      return 'TIDAK DINILAI';
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sertifikat Magang - ${assessment.student_name}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
          @media print {
            body { margin: 0; }
            .certificate-container { 
              width: 100%; 
              height: 100vh; 
              margin: 0; 
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .certificate-content {
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              padding: 40px;
              height: calc(100vh - 40px);
              position: relative;
              overflow: hidden;
            }
            .certificate-content::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23f0f0f0"/><circle cx="75" cy="75" r="1" fill="%23f0f0f0"/><circle cx="50" cy="10" r="0.5" fill="%23f0f0f0"/><circle cx="10" cy="60" r="0.5" fill="%23f0f0f0"/><circle cx="90" cy="40" r="0.5" fill="%23f0f0f0"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
              pointer-events: none;
            }
            .program-photo {
              width: 120px;
              height: 120px;
              object-fit: cover;
              border-radius: 50%;
              border: 4px solid #667eea;
              box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            }
            .certificate-title {
              font-size: 2.5rem;
              font-weight: 800;
              background: linear-gradient(135deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-align: center;
              margin: 20px 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .student-name {
              font-size: 2rem;
              font-weight: 700;
              color: #2c3e50;
              text-align: center;
              margin: 20px 0;
              padding: 15px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              border-radius: 15px;
              box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            }
            .certificate-text {
              font-size: 1.1rem;
              line-height: 1.8;
              text-align: center;
              color: #34495e;
              margin: 20px 0;
            }
            .predikat {
              font-size: 1.5rem;
              font-weight: 700;
              text-align: center;
              margin: 20px 0;
              padding: 15px;
              background: linear-gradient(135deg, #27ae60, #2ecc71);
              color: white;
              border-radius: 15px;
              box-shadow: 0 8px 16px rgba(39, 174, 96, 0.3);
            }
            .signature-section {
              position: absolute;
              bottom: 40px;
              left: 0;
              right: 0;
              display: flex;
              justify-content: space-between;
              padding: 0 40px;
            }
            .signature-box {
              text-align: center;
              flex: 1;
              margin: 0 20px;
            }
            .signature-line {
              width: 200px;
              height: 2px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              margin: 60px auto 10px;
              border-radius: 1px;
            }
            .signature-name {
              font-weight: 600;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            .signature-title {
              font-size: 0.9rem;
              color: #7f8c8d;
            }
            .date-section {
              text-align: center;
              margin-top: 30px;
              color: #7f8c8d;
              font-style: italic;
            }
            .border-decoration {
              position: absolute;
              top: 20px;
              left: 20px;
              right: 20px;
              bottom: 20px;
              border: 3px solid transparent;
              background: linear-gradient(135deg, #667eea, #764ba2) border-box;
              -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: destination-out;
              mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
              mask-composite: exclude;
              border-radius: 15px;
              pointer-events: none;
            }
          }
          
          @page {
            size: A4 landscape;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="certificate-content">
            <div class="border-decoration"></div>
            
            <!-- Program Photo -->
            <div class="text-center mb-4">
              <img src="${assessment.program_photo || ''}" alt="Program Photo" class="program-photo" onerror="this.style.display='none'">
            </div>
            
            <!-- Certificate Title -->
            <h1 class="certificate-title">SERTIFIKAT MAGANG</h1>
            
            <!-- Certificate Text -->
            <p class="certificate-text">
              Sertifikat Ini Diberikan Kepada:
            </p>
            
            <!-- Student Name -->
            <div class="student-name">
              ${assessment.student_name || 'Nama Siswa'}
            </div>
            
            <!-- Description -->
            <p class="certificate-text">
              Sebagai penghargaan atas kerja keras Anda sebagai peserta magang di <strong>${assessment.company_name}</strong> dengan nama program <strong>${assessment.program_title}</strong>
            </p>
            
            <!-- Predikat -->
            <div class="predikat">
              PREDIKAT: ${getPredikat(assessment.final_grade)}
            </div>
            
            <!-- Date -->
            <div class="date-section">
              <p>Diberikan pada: ${currentDate}</p>
            </div>
            
            <!-- Signatures -->
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-name">${assessment.company_name}</div>
                <div class="signature-title">Mengetahui</div>
              </div>
              
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-name">${assessment.mentor_name}</div>
                <div class="signature-title">Menyetujui</div>
              </div>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
                    <li className="breadcrumb-item active" aria-current="page">My Assessments</li>
                  </ol>
                </nav>
                <h2 className="fw-bold text-primary mb-0">My Assessments</h2>
              </div>
              <div className="text-muted">
                Total: {pagination?.total || 0} assessment
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {assessments.length === 0 && !loading ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="fas fa-clipboard-check fa-3x text-muted"></i>
                </div>
                <h5 className="text-muted">Belum ada assessment</h5>
                <p className="text-muted">Anda belum memiliki assessment untuk program apapun.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/student/programs')}
                >
                  Lihat Program Tersedia
                </button>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {assessments.map((assessment) => (
                    <div key={assessment?.id || 'unknown'} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body p-4">
                          {/* Header with status badge */}
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div style={{flex: 1, minWidth: 0}}>
                              <h5 className="card-title fw-bold text-primary mb-1" style={{lineHeight: '1.2', wordBreak: 'break-word'}}>
                                {assessment?.program_title || '-'}
                              </h5>
                              <div className="text-muted" style={{fontSize: '1rem'}}>
                                <i className="fas fa-building me-2"></i>
                                {assessment?.company_name || '-'}
                              </div>
                            </div>
                            <div>
                              {getStatusBadge(assessment?.final_status)}
                            </div>
                          </div>

                          {/* Assessment Information */}
                          <div className="bg-light rounded p-3 mb-3">
                            <div className="row g-2">
                              <div className="col-12">
                                <small className="text-muted d-block fw-medium">Mentor</small>
                                <span className="fw-semibold text-dark">
                                  <i className="fas fa-user-tie me-1"></i>
                                  {assessment?.mentor_name || '-'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Assessment Date */}
                          <div className="mb-3">
                            <small className="text-muted d-block fw-medium mb-1">
                              <i className="fas fa-calendar-alt me-1"></i>
                              Tanggal Assessment
                            </small>
                            <span className="fw-medium text-dark">{formatDate(assessment?.assessment_date)}</span>
                          </div>

                          {/* Action Button */}
                          <div className="mt-auto">
                            <div className="d-grid gap-2">
                              <button
                                className="btn btn-primary"
                                onClick={() => handleDetailClick(assessment?.id)}
                              >
                                <i className="fas fa-eye me-2"></i>
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <nav aria-label="Assessments pagination">
                      <ul className="pagination">
                        <li className={`page-item ${!pagination?.hasPrev ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination?.hasPrev}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                        </li>
                        
                        {Array.from({ length: pagination?.totalPages || 0 }, (_, i) => i + 1).map((page) => (
                          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${!pagination?.hasNext ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination?.hasNext}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <StudentFooter />
    </div>
  );
};

export default AssessmentPage;
