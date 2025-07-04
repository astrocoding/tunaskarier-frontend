import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAssessmentById } from '../../apis/studentApi';
import StudentNavbar from '../../components/student/StudentNavbar';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentFooter from '../../components/student/StudentFooter';

const AssessmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssessmentDetail();
  }, [id]);

  const fetchAssessmentDetail = async () => {
    try {
      setLoading(true);
      const response = await getAssessmentById(id);
      
      console.log('Assessment Detail API Response:', response); // Debug log
      
      setAssessment(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat detail assessment');
      console.error('Error fetching assessment detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeBadge = (grade) => {
    let badgeClass = 'bg-secondary';
    let gradeText = 'N/A';
    
    if (grade >= 86 && grade <= 100) {
      badgeClass = 'bg-success';
      gradeText = 'A';
    } else if (grade >= 76 && grade <= 85) {
      badgeClass = 'bg-info';
      gradeText = 'B';
    } else if (grade >= 60 && grade <= 75) {
      badgeClass = 'bg-warning';
      gradeText = 'C';
    } else if (grade < 60) {
      badgeClass = 'bg-danger';
      gradeText = 'D';
    }
    
    return (
      <span className={`badge ${badgeClass} text-white fs-5 px-4 py-2 rounded-pill`}>
        {gradeText} ({grade})
      </span>
    );
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank');
    // Data
    const nama = assessment.student_name || '-';
    const perusahaan = assessment.company_name || '-';
    const program = assessment.program_title || '-';
    const mentor = assessment.mentor_name || '-';
    const programPhoto = assessment.program_photo || '';
    const predikat = (() => {
      const g = assessment.final_grade;
      if (g >= 86 && g <= 100) return 'SANGAT MEMUASKAN';
      if (g >= 76 && g <= 85) return 'MEMUASKAN';
      if (g >= 60 && g <= 75) return 'CUKUP';
      if (g < 60) return 'KURANG';
      return '-';
    })();
    // Sertifikat HTML
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Sertifikat Magang - ${nama}</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background: #fcfbf7;
          }
          body {
            width: 297mm;
            height: 210mm;
            min-width: 297mm;
            min-height: 210mm;
            max-width: 297mm;
            max-height: 210mm;
            box-sizing: border-box;
            font-family: 'Montserrat', Arial, sans-serif;
            background: #fcfbf7;
          }
          .cert-main {
            width: 100%;
            height: 100%;
            min-height: 100%;
            min-width: 100%;
            max-width: 100%;
            max-height: 100%;
            margin: 0 auto;
            background: #fcfbf7;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 48px 56px 32px 56px;
            border-radius: 18px;
            border: 3px solid #5ac1f4;
            box-shadow: 0 8px 32px rgba(0,0,0,0.07);
            position: relative;
          }
          .cert-header {
            text-align: center;
            margin-bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .program-photo {
            width: 90px;
            height: 90px;
            object-fit: cover;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(33,122,75,0.10);
            margin-bottom: 18px;
            margin-top: 0;
            display: block;
          }
          .cert-title {
            font-size: 2.1rem;
            font-weight: 800;
            color: #5ac1f4;
            letter-spacing: 2px;
            margin-bottom: 0.2rem;
            margin-top: 0;
          }
          .cert-subtitle {
            font-size: 1.1rem;
            font-weight: 600;
            color: #5ac1f4;
            letter-spacing: 1px;
            margin-bottom: 0.7rem;
            margin-top: 0;
          }
          .cert-name {
            font-size: 2.5rem;
            font-weight: 800;
            color: #5ac1f4;
            margin-bottom: 1.1rem;
            margin-top: 0;
            letter-spacing: 1px;
            text-align: center;
          }
          .cert-desc {
            font-size: 1.15rem;
            color: #444;
            margin-bottom: 1rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: center;
          }
          .cert-predikat {
            font-size: 1.25rem;
            font-weight: 700;
            color: #5ac1f4;
            margin-bottom: 20rem;
            margin-top: 0.5rem;
            letter-spacing: 1px;
            text-align: center;
          }
          .cert-sign-row {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 40px;
            position: absolute;
            left: 0; right: 0; bottom: 32px;
            padding: 0 56px;
            box-sizing: border-box;
          }
          .cert-sign-box {
            width: 40%;
            min-width: 180px;
            text-align: left;
          }
          .cert-sign-box.right {
            text-align: right;
          }
          .cert-sign-line {
            border-bottom: 2px solid #5ac1f4;
            width: 70%;
            margin: 0 0 8px 0;
            display: inline-block;
          }
          .cert-sign-name {
            font-weight: 700;
            color: #5ac1f4;
            font-size: 1.08rem;
            margin-bottom: 2px;
          }
          .cert-sign-label {
            font-size: 0.95rem;
            color: #888;
            font-weight: 500;
          }
          @media print {
            html, body {
              width: 297mm;
              height: 210mm;
              min-width: 297mm;
              min-height: 210mm;
              max-width: 297mm;
              max-height: 210mm;
              background: #fcfbf7 !important;
            }
            .cert-main {
              width: 297mm !important;
              height: 210mm !important;
              min-width: 297mm !important;
              min-height: 210mm !important;
              max-width: 297mm !important;
              max-height: 210mm !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              padding: 48px 56px 32px 56px !important;
              background: #fcfbf7 !important;
            }
            .cert-sign-row {
              position: absolute;
              left: 0; right: 0; bottom: 32px;
              padding: 0 56px;
            }
          }
        </style>
      </head>
      <body>
        <div class="cert-main">
          <div class="cert-header">
            ${programPhoto ? `<img src="${programPhoto}" alt="Program Photo" class="program-photo" onerror="this.style.display='none'">` : ''}
            <div class="cert-title">SERTIFIKAT MAGANG</div>
            <div class="cert-subtitle">SERTIFIKAT INI DIBERIKAN KEPADA</div>
            <div class="cert-name">${nama}</div>
          </div>
          <div class="cert-desc">sebagai penghargaan atas kerja keras Anda<br>sebagai peserta magang di <b>${perusahaan}</b> dengan nama program <b>${program}</b></div>
          <div class="cert-predikat">PREDIKAT: ${predikat}</div>
          <div class="cert-sign-row">
            <div class="cert-sign-box">
              <div class="cert-sign-line"></div>
              <div class="cert-sign-name">${perusahaan}</div>
              <div class="cert-sign-label">MENGETAHUI</div>
            </div>
            <div class="cert-sign-box right">
              <div class="cert-sign-line"></div>
              <div class="cert-sign-name">${mentor}</div>
              <div class="cert-sign-label">MENYETUJUI</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
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

  if (error) {
    return (
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <StudentNavbar />
        <div className="container-fluid">
          <div className="row">
            <StudentSidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/student/assessments')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Kembali ke Daftar Assessment
              </button>
            </main>
          </div>
        </div>
        <StudentFooter />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div style={{background: '#f7fafd', minHeight: '100vh'}}>
        <StudentNavbar />
        <div className="container-fluid">
          <div className="row">
            <StudentSidebar />
            <main className="col-md-10 ms-sm-auto px-md-5 px-3 py-4" style={{marginTop: '60px', marginBottom: '100px'}}>
              <div className="alert alert-warning" role="alert">
                Assessment tidak ditemukan
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/student/assessments')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Kembali ke Daftar Assessment
              </button>
            </main>
          </div>
        </div>
        <StudentFooter />
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
                    <li className="breadcrumb-item"><Link to="/student/assessments" className="text-decoration-none">My Assessments</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Detail Assessment</li>
                  </ol>
                </nav>
                <h2 className="fw-bold text-primary mb-0">Detail Assessment</h2>
                <p className="text-muted mb-0">Informasi lengkap assessment program internship</p>
              </div>
              <div className="text-end">
                {getStatusBadge(assessment.final_status)}
                <button 
                  className="btn btn-outline-primary ms-2"
                  onClick={handlePrintCertificate}
                  title="Cetak Sertifikat"
                  style={{border: '1px solid #0d6efd', fontSize: '0.875rem'}}
                >
                  <i className="bi bi-printer me-2"></i>
                  Cetak Sertifikat
                </button>
              </div>
            </div>

            <div className="row g-4">
              {/* Program Information Card */}
              <div className="col-12 col-lg-8">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-briefcase me-2"></i>
                      Informasi Program
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="fas fa-graduation-cap text-primary"></i>
                          </div>
                          <div>
                            <small className="text-muted d-block">Program</small>
                            <span className="fw-semibold">{assessment.program_title}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="fas fa-building text-info"></i>
                          </div>
                          <div>
                            <small className="text-muted d-block">Perusahaan</small>
                            <span className="fw-semibold">{assessment.company_name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="fas fa-user-tie text-success"></i>
                          </div>
                          <div>
                            <small className="text-muted d-block">Mentor</small>
                            <span className="fw-semibold">{assessment.mentor_name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="fas fa-calendar-alt text-warning"></i>
                          </div>
                          <div>
                            <small className="text-muted d-block">Tanggal Assessment</small>
                            <span className="fw-semibold">{formatDate(assessment.assessment_date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grade Section */}
                <div className="card shadow-sm border-0 mt-4">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-star me-2"></i>
                      Nilai Akhir
                    </h5>
                  </div>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      {getGradeBadge(assessment.final_grade)}
                    </div>
                    <p className="text-muted mb-0">
                      <i className="fas fa-info-circle me-1"></i>
                      Nilai berdasarkan performa dan kemampuan teknis
                    </p>
                  </div>
                </div>

                {/* Feedback Sections */}
                <div className="card shadow-sm border-0 mt-4">
                  <div className="card-header bg-info text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-comments me-2"></i>
                      Feedback
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    {/* Final Feedback */}
                    <div className="mb-4">
                      <h6 className="fw-semibold text-primary mb-3">
                        <i className="fas fa-clipboard-check me-2"></i>
                        Feedback Akhir
                      </h6>
                      <div className="bg-light border-start border-primary border-4 p-3 rounded">
                        <p className="mb-0 text-dark">{assessment.final_feedback}</p>
                      </div>
                    </div>

                    {/* Mentor Feedback */}
                    {assessment.mentor_feedback && (
                      <div>
                        <h6 className="fw-semibold text-info mb-3">
                          <i className="fas fa-user-tie me-2"></i>
                          Feedback Mentor
                        </h6>
                        <div className="bg-light border-start border-info border-4 p-3 rounded">
                          <p className="mb-0 text-dark">{assessment.mentor_feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Information Card */}
              <div className="col-12 col-lg-4">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-user me-2"></i>
                      Informasi Siswa
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-secondary bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="fas fa-user-graduate text-secondary"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Nama Siswa</small>
                        <span className="fw-semibold">{assessment.student_name}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="bg-secondary bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="fas fa-id-card text-secondary"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">NIS</small>
                        <span className="fw-semibold">{assessment.student_nis}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assessment Timeline */}
                <div className="card shadow-sm border-0 mt-4">
                  <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-clock me-2"></i>
                      Timeline
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-marker bg-primary"></div>
                        <div className="timeline-content">
                          <h6 className="fw-semibold">Assessment Selesai</h6>
                          <small className="text-muted">{formatDate(assessment.updated_at)}</small>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-marker bg-success"></div>
                        <div className="timeline-content">
                          <h6 className="fw-semibold">Assessment Dimulai</h6>
                          <small className="text-muted">{formatDate(assessment.created_at)}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <StudentFooter />

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 20px;
        }
        .timeline-marker {
          position: absolute;
          left: -35px;
          top: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .timeline-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: -29px;
          top: 17px;
          width: 2px;
          height: calc(100% + 3px);
          background-color: #dee2e6;
        }
      `}</style>
    </div>
  );
};

export default AssessmentDetailPage;