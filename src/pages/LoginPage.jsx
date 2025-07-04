import { useState } from 'react';
import logo from '../assets/images/logo_tunaskarier.png';
import { login } from '../apis/authApi';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      if (res.data && res.data.user && res.data.user.role) {
        const role = res.data.user.role;
        const userId = res.data.user.id;
        
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('role', role);
        localStorage.setItem('user_id', userId);
        
        if (role === 'student') {
          localStorage.setItem('id_student', userId);
        }
        
        // Redirect berdasarkan role
        switch (role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'company':
            navigate('/company');
            break;
          case 'mentor':
            navigate('/mentor');
            break;
          case 'student':
            navigate('/student');
            break;
          default:
            setError('Role tidak valid.');
        }
      } else {
        setError('Data user tidak valid.');
      }
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #eff6fe 100%)'}}>
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="bg-white rounded-4 shadow-lg overflow-hidden" style={{minHeight:'500px'}}>
            {/* Logo Section */}
            <div className="text-center py-4 px-4" style={{background: 'linear-gradient(135deg, #f7fafd 0%, #e2e8f0 100%)'}}>
              <img 
                src={logo} 
                alt="Logo TunasKarier" 
                style={{
                  height: '70px',
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  cursor: 'pointer'
                }} 
                onClick={() => navigate('/')}
              />
              <h4 className="text-primary fw-bold mt-3 mb-0">Selamat Datang</h4>
              <p className="text-muted mb-0">Masuk ke akun TunasKarier Anda</p>
            </div>
            
            {/* Form Section */}
            <div className="p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label fw-semibold text-dark mb-2">
                    <i className="bi bi-envelope me-2 text-primary"></i>
                    Email
                  </label>
                  <input 
                    type="email" 
                    className="form-control border-2" 
                    id="loginEmail" 
                    placeholder="Masukkan email Anda" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="loginPassword" className="form-label fw-semibold text-dark mb-2">
                    <i className="bi bi-lock me-2 text-primary"></i>
                    Password
                  </label>
                  <div className="position-relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-control border-2 pe-5" 
                      id="loginPassword" 
                      placeholder="Masukkan password Anda" 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      style={{borderColor: '#e2e8f0', fontSize: '0.95rem'}}
                    />
                    <button 
                      type="button" 
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3 text-muted"
                      onClick={togglePasswordVisibility}
                      style={{border: 'none', background: 'none'}}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="alert alert-danger py-3 mb-3 border-0" style={{background: '#fef2f2', color: '#dc2626'}}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-3 fw-semibold mb-3" 
                  disabled={loading}
                  style={{
                    background: '#5ac1f4',
                    border: 'none',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = '#4bb8e8';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(90, 193, 244, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = '#5ac1f4';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" style={{width: '1rem', height: '1rem'}} role="status" aria-hidden="true"></span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Masuk
                    </>
                  )}
                </button>
              </form>
              
              <div className="text-center">
                <span className="text-muted">Baru di TunasKarier?</span>
                <a href="/register" className="text-primary fw-semibold ms-1 text-decoration-none">
                  Daftar disini
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="position-fixed bottom-0 end-0 p-3 small" style={{zIndex:10, color: '#5ac1f4'}}>
        &copy; {new Date().getFullYear()} <b>TunasKarier</b>
      </footer>
    </div>
  );
};

export default LoginPage; 