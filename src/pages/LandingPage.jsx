import '../styles/LandingPage.css';
import logo from '../assets/images/logo_tunaskarier.png';
import mandiri from '../assets/images/mandiri.png';
import google from '../assets/images/google.png';
import ProgramCard from '../components/ProgramCard';

const LandingPage = () => {
  return (
    <>
      <header className="tk-header py-2 bg-light border-bottom">
        <div className="container d-flex align-items-center justify-content-between">
          <a href="/">
            <img src={logo} alt="Logo TunasKarier" className="tk-logo ms-4" style={{height:'60px',width:'auto'}} />
          </a>
          <nav className="d-none d-md-flex gap-4 align-items-center">
            <a href="#lowongan" className="text-decoration-none text-primary">Lowongan</a>
            <a href="#keunggulan" className="text-decoration-none text-primary">Keunggulan</a>
            <a href="#faq" className="text-decoration-none text-primary">FAQ</a>
            <a href="/login" className="btn btn-primary px-4">Login</a>
          </nav>
          <button className="btn btn-outline-primary d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNav"><i className="bi bi-list"></i></button>
        </div>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNav">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body d-flex flex-column gap-3">
            <a href="#lowongan" className="text-decoration-none text-primary">Lowongan</a>
            <a href="#keunggulan" className="text-decoration-none text-primary">Keunggulan</a>
            <a href="#partner" className="text-decoration-none text-primary">Partner</a>
            <a href="#faq" className="text-decoration-none text-primary">FAQ</a>
            <a href="/login" className="btn btn-primary">Login</a>
          </div>
        </div>
      </header>

      <section className="tk-hero py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mx-auto g-4">
            <div className="col-lg-6">
              <h1 className="fw-bold text-primary mb-3">Temukan Kesempatan Magang<br/>di Berbagai Perusahaan Ternama</h1>
              <p className="mb-4">Gabung dan dapatkan pengalaman magang terbaik untuk siswa SMK di seluruh Indonesia.</p>
              <a href="#lowongan" className="btn btn-primary btn-lg px-4">Cari Lowongan</a>
            </div>
            <div className="col-lg-6 text-center">
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80" alt="Magang SMK" className="img-fluid rounded-4 shadow" />
            </div>
          </div>
        </div>
      </section>

      <section className="tk-search py-3" id="lowongan">
        <div className="container">
          <form className="row g-2 align-items-center justify-content-center bg-white rounded-3 shadow p-3">
            <div className="col-12 col-md-4">
              <input type="text" className="form-control" placeholder="Cari posisi magang..." />
            </div>
            <div className="col-6 col-md-3">
              <select className="form-select">
                <option>Semua Lokasi</option>
                <option>Jakarta</option>
                <option>Bandung</option>
                <option>Surabaya</option>
              </select>
            </div>
            <div className="col-6 col-md-3">
              <select className="form-select">
                <option>Semua Kategori</option>
                <option>Technology Information</option>
                <option>Marketing</option>
                <option>Design</option>
                <option>Finance</option>
                <option>Human Resource</option>
                <option>Accounting</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <button type="submit" className="btn btn-primary w-100">Cari</button>
            </div>
          </form>
        </div>
      </section>

      <section className="tk-lowongan py-5">
        <div className="container">
          <h2 className="text-center text-primary mb-4">Lowongan Magang Terbaru</h2>
          <div className="row g-4 justify-content-center">
            <ProgramCard
              companyLogo={google}
              companyName="Google Indonesia"
              position="Software Engineer Intern"
              location="Jakarta"
              positions={3}
              tags={["IT"]}
              duration="6 bulan"
              workType="Hybrid"
              createdAt="2 hari yang lalu"
              onClick={() => console.log('Google job clicked')}
            />
            
            <ProgramCard
              companyLogo="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              companyName="Microsoft"
              position="UI/UX Designer Intern"
              location="Bandung"
              positions={2}
              tags={["Desain"]}
              duration="3 bulan"
              workType="Remote"
              createdAt="3 hari yang lalu"
              onClick={() => console.log('Microsoft job clicked')}
            />
            
            <ProgramCard
              companyLogo={mandiri}
              companyName="Bank Mandiri"
              position="Administrasi Keuangan Intern"
              location="Surabaya"
              positions={1}
              tags={["Keuangan"]}
              duration="2 bulan"
              workType="Onsite"
              createdAt="5 hari yang lalu"
              onClick={() => console.log('Mandiri job clicked')}
            />
          </div>
        </div>
      </section>

      <section className="tk-stats py-5 bg-light">
        <div className="container">
          <div className="row text-center justify-content-center g-4">
            <div className="col-6 col-md-4">
              <h3 className="text-primary fw-bold">10.000+</h3>
              <p>Peserta Magang</p>
            </div>
            <div className="col-6 col-md-4">
              <h3 className="text-primary fw-bold">500+</h3>
              <p>Perusahaan</p>
            </div>
            <div className="col-6 col-md-4">
              <h3 className="text-primary fw-bold">100+</h3>
              <p>Kota/Kabupaten</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tk-keunggulan py-5 bg-body-tertiary" id="keunggulan">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-5 text-center">
              <img src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80" alt="Keunggulan" className="img-fluid rounded-4 shadow" />
            </div>
            <div className="col-md-7">
              <h2 className="text-primary fw-bold mb-3">Apa yang TunasKarier Tawarkan?</h2>
              <ul className="list-unstyled fs-5">
                <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Gabung di perusahaan multinasional terbaik</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Proses pendaftaran mudah dan cepat</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Didampingi mentor profesional</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Pengalaman kerja nyata di industri</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="tk-banner py-5">
        <div className="container">
          <div className="row align-items-center mx-auto g-4">
            <div className="col-md-4 text-center">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" alt="Stop Pelecehan" className="img-fluid rounded-4" />
            </div>
            <div className="col-md-8">
              <h2 className="text-primary fw-bold mb-2">STOP Pelecehan Seksual di Lingkungan Kerja</h2>
              <p className="mb-0">Lapor melalui Whistle Blowing System (WBS) jika menemukan tindakan tidak pantas di lingkungan magang.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tk-testimoni py-5">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <p className="card-text">"Magang di TunasKarier sangat membantu saya mendapatkan pengalaman kerja pertama!"</p>
                  <span className="text-primary fw-semibold">- Andini, SMK Negeri 1</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <p className="card-text">"Proses pendaftaran mudah dan banyak pilihan perusahaan."</p>
                  <span className="text-primary fw-semibold">- Rizky, SMK PGRI</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <p className="card-text">"Mentor sangat ramah dan membimbing selama magang."</p>
                  <span className="text-primary fw-semibold">- Siti, SMK Muhammadiyah</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tk-faq py-5 bg-body-tertiary" id="faq">
        <div className="container">
          <h2 className="text-center text-primary mb-4">Pertanyaan yang Sering Ditanyakan</h2>
          <div className="accordion accordion-flush" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq1">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapse1">
                  Bagaimana cara mendaftar magang?
                </button>
              </h2>
              <div id="collapse1" className="accordion-collapse collapse" aria-labelledby="faq1" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Daftar akun, lengkapi profil, lalu pilih lowongan magang yang diinginkan.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq2">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                  Apakah magang ini berbayar?
                </button>
              </h2>
              <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="faq2" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Tidak, seluruh proses pendaftaran magang gratis.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq3">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                  Apakah ada sertifikat setelah magang?
                </button>
              </h2>
              <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="faq3" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Ya, peserta akan mendapatkan sertifikat setelah menyelesaikan magang.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="tk-footer py-4 bg-light mt-4">
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-md-4">
              <div className="footer-brand">
                <img src={logo} alt="Logo TunasKarier" className="tk-logo-footer" style={{height: '100px', width: 'auto'}} />
                <div>
                  <div className="fw-semibold">TunasKarier Indonesia</div>
                  <div>Platform magang SMK terbaik untuk masa depan generasi muda.</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <h5>Menu</h5>
              <ul className="list-unstyled">
                <li><a href="#lowongan" className="text-decoration-none text-primary">Lowongan</a></li>
                <li><a href="#keunggulan" className="text-decoration-none text-primary">Keunggulan</a></li>
                <li><a href="#partner" className="text-decoration-none text-primary">Partner</a></li>
                <li><a href="#faq" className="text-decoration-none text-primary">FAQ</a></li>
              </ul>
            </div>
            <div className="col-6 col-md-4">
              <h5>Kontak</h5>
              <p className="mb-1">Email: info@tunaskarier.id</p>
              <p>Instagram: @tunaskarier.id</p>
            </div>
          </div>
          <div className="text-center text-secondary mt-4 pt-2 border-top">&copy; {new Date().getFullYear()} <b>TunasKarier</b>. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
