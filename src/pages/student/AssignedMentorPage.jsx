import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/student/StudentNavbar';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentFooter from '../../components/student/StudentFooter';
import { Link } from 'react-router-dom';

const AssignedMentorPage = () => {
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call - replace with actual API call when available
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        // Mock data based on the provided response
        // Replace this with actual API call: const response = await getAssignedMentor();
        const mockResponse = {
          status: "success",
          message: "Data mentor berhasil diambil",
          data: {
            id: "user-KkR6yz_nF5sap_yi",
            email: "zaenalalfian20@gmail.com",
            role: "mentor",
            created_at: "2025-06-29T05:06:37.193Z",
            updated_at: "2025-06-29T05:06:37.193Z",
            mentor_id: "mentor-BYGa2PafeNnC3wJM",
            full_name: "Zaenal Alfian",
            position: "Senior Developer",
            gender: "male",
            phone_number: "081617863869",
            department: "Development Department",
            id_company: "company-eVDvh0pMWEQkpJ25",
            company_name: "Kodetopia Indonesia"
          }
        };
        
        setMentorData(mockResponse.data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data mentor');
        console.error('Error fetching mentor data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  const getRoleBadge = (role) => {
    return (
      <span className="badge bg-primary text-white px-3 py-2">
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getGenderText = (gender) => {
    return gender === 'male' ? 'Laki-laki' : 'Perempuan';
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
                    <li className="breadcrumb-item active" aria-current="page">Assigned Mentor</li>
                  </ol>
                </nav>
                <h2 className="fw-bold text-primary mb-0">Assigned Mentor</h2>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {!mentorData ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="fas fa-user-tie fa-3x text-muted"></i>
                </div>
                <h5 className="text-muted">Belum ada mentor yang ditugaskan</h5>
                <p className="text-muted">Anda belum memiliki mentor yang ditugaskan untuk program ini.</p>
              </div>
            ) : (
              <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                  <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                      {/* Header with role badge */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div style={{flex: 1, minWidth: 0}}>
                          <h5 className="card-title fw-bold text-primary mb-1" style={{lineHeight: '1.2', wordBreak: 'break-word'}}>
                            {mentorData.full_name}
                          </h5>
                          <div className="text-muted" style={{fontSize: '1rem'}}>
                            <i className="fas fa-building me-2"></i>
                            {mentorData.company_name}
                          </div>
                        </div>
                        <div>
                          {getRoleBadge(mentorData.role)}
                        </div>
                      </div>

                      {/* Position and Department */}
                      <div className="bg-light rounded p-3 mb-3">
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted d-block fw-medium">Posisi</small>
                            <span className="fw-semibold text-dark">{mentorData.position}</span>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block fw-medium">Departemen</small>
                            <span className="fw-semibold text-dark">{mentorData.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="mb-3">
                        <small className="text-muted d-block fw-medium mb-1">
                          <i className="fas fa-envelope me-1"></i>
                          Email
                        </small>
                        <span className="fw-medium text-dark">{mentorData.email}</span>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block fw-medium mb-1">
                          <i className="fas fa-phone me-1"></i>
                          Nomor Telepon
                        </small>
                        <span className="fw-medium text-dark">{mentorData.phone_number}</span>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block fw-medium mb-1">
                          <i className="fas fa-venus-mars me-1"></i>
                          Jenis Kelamin
                        </small>
                        <span className="fw-medium text-dark">{getGenderText(mentorData.gender)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <StudentFooter />
    </div>
  );
};

export default AssignedMentorPage;
