import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProgramById, deleteProgram } from '../apis/companyApi';
import Swal from 'sweetalert2';
import '../styles/Global.css';

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        setLoading(true);
        const response = await getProgramById(id);
        setProgram(response.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat detail program');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProgramDetail();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      // Konfirmasi delete dengan SweetAlert
      const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: `Program "${program.title}" akan dihapus secara permanen!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        // Tampilkan loading dan langsung panggil API
        Swal.fire({
          title: 'Menghapus Program...',
          text: 'Mohon tunggu sebentar',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Panggil API delete dengan timeout
        const deletePromise = deleteProgram(id);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        await Promise.race([deletePromise, timeoutPromise]);

        // Redirect langsung tanpa menunggu SweetAlert
        navigate('/company');
        
        // Tampilkan success message setelah redirect
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Program berhasil dihapus',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true
        });
      }
    } catch (err) {
      console.error('Error deleting program:', err);
      
      // Tampilkan error message
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus Program',
        text: err.message || 'Terjadi kesalahan saat menghapus program. Silakan coba lagi.',
        confirmButtonColor: '#d33',
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { class: 'bg-success', text: 'Terbuka', icon: 'bi-check-circle' },
      'closed': { class: 'bg-danger', text: 'Ditutup', icon: 'bi-x-circle' },
      'draft': { class: 'bg-warning', text: 'Draft', icon: 'bi-pencil' }
    };
    
    const config = statusConfig[status] || statusConfig['draft'];
    return (
      <span className={`badge ${config.class} text-white px-3 py-2`}>
        <i className={`bi ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getInternTypeBadge = (type) => {
    const typeConfig = {
      'onsite': { class: 'bg-primary', text: 'Onsite', icon: 'bi-building' },
      'remote': { class: 'bg-info', text: 'Remote', icon: 'bi-laptop' },
      'hybrid': { class: 'bg-secondary', text: 'Hybrid', icon: 'bi-phone' }
    };
    
    const config = typeConfig[type] || typeConfig['onsite'];
    return (
      <span className={`badge ${config.class} text-white px-3 py-2`}>
        <i className={`bi ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
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
              onClick={() => navigate('/company')}
            >
              <i className="bi bi-arrow-left me-1"></i>Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Program tidak ditemukan
            </div>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/company')}
            >
              <i className="bi bi-arrow-left me-1"></i>Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{background: '#f7fafd', minHeight: '100vh'}}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          {/* Breadcrumb */}
          <div className="mb-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2">
                <li className="breadcrumb-item">
                  <Link to="/company" className="text-decoration-none text-muted">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active text-primary">
                  Detail Program
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/company')}
            >
              <i className="bi bi-arrow-left me-1"></i>Kembali
            </button>
            <div className="d-flex gap-2">
              {getStatusBadge(program.status)}
              {getInternTypeBadge(program.intern_type)}
            </div>
          </div>

          {/* Main Content */}
          <div className="card shadow-sm border-0 program-detail-card">
            <div className="card-body p-4">
              {/* Company Info */}
              <div className="d-flex align-items-center mb-4">
                <img 
                  src={program.photo || 'https://placehold.co/400'} 
                  alt={`Logo ${program.company_name}`} 
                  className="rounded me-3"
                  style={{
                    height: '60px',
                    width: '60px',
                    objectFit: 'cover'
                  }}
                />
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
                    onClick={() => navigate(`/company/programs/${id}/edit`)}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Program
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-lg px-4"
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Hapus Program
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
