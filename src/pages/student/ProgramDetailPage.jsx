import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentNavbar from '../../components/student/StudentNavbar';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentFooter from '../../components/student/StudentFooter';
import { getStudentProgramDetail, applyToProgram } from '../../apis/studentApi';
import '../../styles/Global.css';

const ProgramDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const [recUrl, setRecUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getStudentProgramDetail(id);
        console.log('Program detail response:', res); // Debug log
        console.log('Program data structure:', res.data); // Debug complete program data
        if (res.status === 'success' && res.data) {
          setProgram(res.data);
        } else {
          setError(res.message || 'Gagal mengambil detail program');
        }
      } catch (err) {
        setError(err.message || 'Gagal mengambil detail program');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Modal handlers
  const openModal = () => {
    setShowModal(true);
    setCvUrl('');
    setRecUrl('');
    setSubmitError(null);
    setSubmitSuccess(null);
  };
  const closeModal = () => {
    setShowModal(false);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // Handle apply submit
  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const id_student = localStorage.getItem('id_student') || localStorage.getItem('user_id');
      if (!id_student) throw new Error('ID student tidak ditemukan. Silakan login ulang.');
      if (!cvUrl || !recUrl) throw new Error('CV URL dan Recommendation Letter URL wajib diisi.');
      
      // Validate and convert program ID
      const programId = id; // Keep as string since API returns string ID
      if (!programId || programId.trim() === '') {
        throw new Error('ID program tidak valid');
      }
      
      console.log('Program ID:', programId, 'Type:', typeof programId); // Debug log
      
      const payload = {
        id_program: programId,
        cv_url: cvUrl,
        recommendation_letter_url: recUrl
      };
      
      const alternativePayload = {
        program_id: programId,
        cv_url: cvUrl,
        recommendation_letter_url: recUrl
      };
      
      // Third alternative - maybe API only needs program_id and gets student_id from token
      const simplePayload = {
        id_program: programId, // Use id_program as primary field
        cv_url: cvUrl,
        recommendation_letter_url: recUrl
      };
      
      // Fourth alternative - maybe API expects different field names
      const alternativePayload2 = {
        program_id: programId,
        cv_url: cvUrl,
        recommendation_letter_url: recUrl
      };
      
      // Fifth alternative - maybe API expects nested structure
      const nestedPayload = {
        program: {
          id: programId
        },
        cv_url: cvUrl,
        recommendation_letter_url: recUrl
      };
      
      // Sixth alternative - maybe API expects just the program ID and URLs
      const minimalPayload = {
        program_id: programId,
        cv_url: cvUrl,
        recommendation_letter_url: recUrl
      };
      
      // Seventh alternative - maybe API expects different field names
      const fieldNamePayload = {
        id: programId,
        cv_url: cvUrl,
        recommendation_letter_url: recUrl
      };
      
      // Debug: Log the payload being sent
      console.log('Sending payload:', payload);
      console.log('Alternative payload:', alternativePayload);
      console.log('Simple payload:', simplePayload);
      console.log('Alternative payload 2:', alternativePayload2);
      console.log('Nested payload:', nestedPayload);
      console.log('Minimal payload:', minimalPayload);
      console.log('Field name payload:', fieldNamePayload);
      
      const token = localStorage.getItem('token');
      
      // Try the main applications endpoint with different payload structures
      const endpoint = 'http://159.223.59.60/api/applications';
      console.log(`Using endpoint: ${endpoint}`);
      
      let response = null;
      let lastError = null;
      
      // Try with first payload structure (id_program)
      try {
        console.log('Trying payload 1:', payload);
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          console.log('Success with payload 1:', payload);
        } else {
          const errorData = await response.json();
          console.log('Error with payload 1:', errorData);
          lastError = errorData;
          
          // Try with alternative payload structure (program_id)
          console.log('Trying payload 2:', alternativePayload);
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(alternativePayload)
          });
          
          if (response.ok) {
            console.log('Success with payload 2:', alternativePayload);
          } else {
            const errorData2 = await response.json();
            console.log('Error with payload 2:', errorData2);
            lastError = errorData2;
            
            // Try with alternative payload 2 (program_id)
            console.log('Trying payload 3:', alternativePayload2);
            response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(alternativePayload2)
            });
            
            if (response.ok) {
              console.log('Success with payload 3:', alternativePayload2);
            } else {
              const errorData3 = await response.json();
              console.log('Error with payload 3:', errorData3);
              lastError = errorData3;
              
              // Try with nested payload
              console.log('Trying payload 4:', nestedPayload);
              response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(nestedPayload)
              });
              
              if (response.ok) {
                console.log('Success with payload 4:', nestedPayload);
              } else {
                const errorData4 = await response.json();
                console.log('Error with payload 4:', errorData4);
                lastError = errorData4;
                
                // Try with minimal payload
                console.log('Trying payload 5:', minimalPayload);
                response = await fetch(endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(minimalPayload)
                });
                
                if (response.ok) {
                  console.log('Success with payload 5:', minimalPayload);
                } else {
                  const errorData5 = await response.json();
                  console.log('Error with payload 5:', errorData5);
                  lastError = errorData5;
                  
                  // Try with field name payload
                  console.log('Trying payload 6:', fieldNamePayload);
                  response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(fieldNamePayload)
                  });
                  
                  if (response.ok) {
                    console.log('Success with payload 6:', fieldNamePayload);
                  } else {
                    const errorData6 = await response.json();
                    console.log('Error with payload 6:', errorData6);
                    lastError = errorData6;
                    
                    // Final fallback: try using the applyToProgram function
                    console.log('Trying fallback with applyToProgram function');
                    try {
                      const result = await applyToProgram(programId, {
                        cv_url: cvUrl,
                        recommendation_letter_url: recUrl
                      });
                      console.log('Success with applyToProgram function:', result);
                      response = { ok: true }; // Mark as successful
                    } catch (fallbackError) {
                      console.log('Error with applyToProgram function:', fallbackError);
                      lastError = fallbackError;
                      
                      // Try with direct program apply endpoint
                      console.log('Trying direct program apply endpoint');
                      try {
                        const directResponse = await fetch(`http://159.223.59.60/api/students/programs/${programId}/apply`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            cv_url: cvUrl,
                            recommendation_letter_url: recUrl
                          })
                        });
                        
                        if (directResponse.ok) {
                          console.log('Success with direct program apply endpoint');
                          response = { ok: true }; // Mark as successful
                        } else {
                          const directError = await directResponse.json();
                          console.log('Error with direct program apply endpoint:', directError);
                          lastError = directError;
                        }
                      } catch (directError) {
                        console.log('Network error with direct endpoint:', directError);
                        lastError = directError;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.log('Network error:', err);
        lastError = err;
      }
      
      if (!response || !response.ok) {
        console.log('All attempts failed. Last error:', lastError); // Debug: Log error response
        throw new Error(lastError?.message || lastError?.error || 'Gagal apply program');
      }
      
      // If we used the fallback function, we don't need to parse JSON
      let result;
      if (response.json) {
        result = await response.json();
      } else {
        result = { success: true }; // For fallback case
      }
      
      console.log('Success response:', result); // Debug: Log success response
      setSubmitSuccess('Berhasil apply program!');
      
      // Refresh program data to update application status
      setTimeout(async () => {
        try {
          const res = await getStudentProgramDetail(id);
          if (res.status === 'success' && res.data) {
            setProgram(res.data);
          }
        } catch (err) {
          console.error('Error refreshing program data:', err);
        }
        setShowModal(false);
        setSubmitSuccess(null);
      }, 1500);
    } catch (err) {
      console.error('Apply error:', err); // Debug: Log any errors
      setSubmitError(err.message || 'Gagal apply program');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Memuat detail program...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/student/programs')}
            >
              <i className="bi bi-arrow-left me-1"></i>Kembali ke Program
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return null;
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
                    <li className="breadcrumb-item"><Link to="/student/programs" className="text-decoration-none">Program Tersedia</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Detail Program</li>
                  </ol>
                </nav>
                <h2 className="fw-bold text-primary mb-0">Detail Program</h2>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/student/programs')}
                >
                  <i className="bi bi-arrow-left me-1"></i>Kembali
                </button>
                <div className="d-flex">
                  <span className="badge bg-success text-white px-3 py-3"><i className="bi bi-check-circle me-1"></i>{program.status === 'open' ? 'Terbuka' : 'Ditutup'}</span>
                  <span className="badge bg-info text-white px-3 py-3"><i className="bi bi-laptop me-1"></i>{program.intern_type}</span>
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="card shadow-sm border-0 program-detail-card">
              <div className="card-body p-4">
                {/* Company Info */}
                <div className="d-flex align-items-center mb-4">
                  <img 
                    src={program.photo || 'https://via.placeholder.com/60x60?text=Logo'} 
                    alt={`Logo ${program.company_name}`} 
                    className="rounded me-3"
                    style={{height: '60px', width: '60px', objectFit: 'cover'}} />
                  <div>
                    <h6 className="text-muted mb-0">{program.company_name}</h6>
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      Dibuat {formatDate(program.created_at)}
                    </small>
                  </div>
                </div>
                {/* Program Title */}
                <h2 className="fw-bold text-primary mb-3">{program.title}</h2>
                {/* Key Info Grid */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-light rounded p-3 text-center info-grid-item">
                      <i className="bi bi-geo-alt text-primary fs-4"></i>
                      <div className="fw-semibold mt-2">{program.location}</div>
                      <small className="text-muted">Lokasi</small>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-light rounded p-3 text-center info-grid-item">
                      <i className="bi bi-calendar text-info fs-4"></i>
                      <div className="fw-semibold mt-2">{program.duration}</div>
                      <small className="text-muted">Durasi</small>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-light rounded p-3 text-center info-grid-item">
                      <i className="bi bi-people text-success fs-4"></i>
                      <div className="fw-semibold mt-2">{program.quota} Posisi</div>
                      <small className="text-muted">Quota</small>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-light rounded p-3 text-center info-grid-item">
                      <i className="bi bi-person-badge text-warning fs-4"></i>
                      <div className="fw-semibold mt-2">{program.mentor_name}</div>
                      <small className="text-muted">Mentor</small>
                    </div>
                  </div>
                </div>
                {/* Description */}
                <div className="mb-4">
                  <h5 className="fw-semibold mb-3">
                    <i className="bi bi-file-text text-primary me-2"></i>
                    Deskripsi Program
                  </h5>
                  <div className="bg-light rounded p-3">
                    <p className="mb-0">{program.description}</p>
                  </div>
                </div>
                {/* Two Column Layout for Details */}
                <div className="row g-4">
                  {/* Left Column */}
                  <div className="col-12 col-lg-6">
                    {/* Qualifications */}
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-primary text-white">
                        <h6 className="mb-0">
                          <i className="bi bi-list-check me-2"></i>
                          Kualifikasi
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="bg-light rounded p-3">
                          <p className="mb-0">{program.qualification}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="col-12 col-lg-6">
                    {/* Benefits */}
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-success text-white">
                        <h6 className="mb-0">
                          <i className="bi bi-gift me-2"></i>
                          Benefit
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="bg-light rounded p-3">
                          <p className="mb-0">{program.benefits}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Timeline */}
                <div className="mt-4">
                  <h5 className="fw-semibold mb-3">
                    <i className="bi bi-calendar-event text-primary me-2"></i>
                    Timeline Program
                  </h5>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="bg-light rounded p-3 timeline-item">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{width: '40px', height: '40px'}}>
                            <i className="bi bi-play-fill text-white"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">Tanggal Mulai</div>
                            <div className="text-muted">{formatDate(program.start_date)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="bg-light rounded p-3 timeline-item">
                        <div className="d-flex align-items-center">
                          <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{width: '40px', height: '40px'}}>
                            <i className="bi bi-check-lg text-white"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">Tanggal Selesai</div>
                            <div className="text-muted">{formatDate(program.end_date)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex flex-column flex-md-row gap-2 justify-content-center action-buttons">
                    <button 
                      className="btn btn-primary btn-lg px-4"
                      onClick={openModal}
                      disabled={!program.can_apply || program.already_applied || program.status === 'registered' || program.status === 'reviewing' || program.status === 'accepted' || submitting}
                    >
                      <i className="bi bi-send me-2"></i>
                      {program.already_applied || program.status === 'registered' ? 'Sudah Apply' : 'Apply Program'}
                    </button>
                  </div>
                  {/* Reason/info if cannot apply */}
                  {((!program.can_apply || program.already_applied || program.status === 'registered' || program.status === 'reviewing' || program.status === 'accepted') && program.reason) && (
                    <div className="alert alert-warning mt-3 text-center">{program.reason}</div>
                  )}
                </div>
              </div>
            </div>
            {/* Modal Apply Program */}
            {showModal && (
              <>
                <div className="custom-modal-backdrop" onClick={closeModal} />
                <div className="custom-modal-wrapper">
                  <div className="custom-modal-content">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                      <h5 className="mb-0">Apply Program</h5>
                      <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleApply}>
                      {submitError && <div className="alert alert-danger">{submitError}</div>}
                      {submitSuccess && <div className="alert alert-success">{submitSuccess}</div>}
                      <div className="mb-3">
                        <label className="form-label">CV URL (Google Drive, PDF, dll)</label>
                        <input type="url" className="form-control" value={cvUrl} onChange={e => setCvUrl(e.target.value)} placeholder="https://..." required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Recommendation Letter URL (opsional)</label>
                        <input type="url" className="form-control" value={recUrl} onChange={e => setRecUrl(e.target.value)} placeholder="https://..." required />
                      </div>
                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Batal</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                          {submitting ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-send me-2"></i>}
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <style>{`
                  .custom-modal-backdrop {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.4);
                    z-index: 1050;
                  }
                  .custom-modal-wrapper {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1060;
                  }
                  .custom-modal-content {
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(30,144,255,0.15);
                    max-width: 420px;
                    width: 100%;
                    padding: 2rem 1.5rem 1.5rem 1.5rem;
                    position: relative;
                  }
                `}</style>
              </>
            )}
          </main>
        </div>
      </div>
      <StudentFooter />
    </div>
  );
};

export default ProgramDetailPage;
