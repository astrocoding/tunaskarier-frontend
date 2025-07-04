import axios from 'axios';

const API_BASE_URL = 'http://159.223.59.60';

// Fungsi untuk decode JWT token dan mengambil company_id
const getCompanyIdFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Decode JWT token (base64 decode payload)
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    console.log('Decoded JWT payload:', decodedPayload);
    
    // Ambil company_id dari user object dalam JWT
    if (decodedPayload.user && decodedPayload.user.company_id) {
      return decodedPayload.user.company_id;
    }
    
    // Fallback ke field lain jika ada
    return decodedPayload.company_id || decodedPayload.id_company || null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// Fungsi untuk menambah mentor baru (role company)
export const createMentor = async (mentorData) => {
  try {
    const token = localStorage.getItem('token');
    const company_id = getCompanyIdFromToken() || localStorage.getItem('id_company');
    console.log('Company ID dari JWT:', company_id);
    
    // Validasi data yang diperlukan
    if (!mentorData.email || !mentorData.password || !mentorData.full_name || 
        !mentorData.position || !mentorData.phone_number || !mentorData.department) {
      throw new Error('Semua field wajib diisi');
    }
    
    if (!company_id) {
      throw new Error('Company ID tidak ditemukan. Silakan login ulang.');
    }
    
    // Kirim data tanpa field photo
    const data = {
      ...mentorData,
      company_id: company_id
    };
    
    // Hapus field photo jika ada
    delete data.photo;
    
    console.log('Data yang akan dikirim:', data);
    
    const response = await axios.post(`${API_BASE_URL}/api/mentors`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating mentor:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengambil semua mentor milik company
export const getMentorsCompany = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await axios.get(`${API_BASE_URL}/api/mentors?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    
    console.log('Mentors API Response:', response.data);
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    console.error('Error fetching mentors:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengambil data mentor berdasarkan ID
export const getMentorById = async (mentorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/mentors/${mentorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk update mentor milik company
export const updateMentor = async (mentorId, mentorData) => {
  try {
    const token = localStorage.getItem('token');
    const company_id = getCompanyIdFromToken() || localStorage.getItem('id_company');
    const data = {
      ...mentorData,
      company_id: company_id
    };
    
    // Hapus field photo jika ada
    delete data.photo;
    
    const response = await axios.put(`${API_BASE_URL}/api/mentors/${mentorId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk menghapus mentor milik company
export const deleteMentor = async (mentorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/api/mentors/${mentorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 8000 // 8 detik timeout
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting mentor:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};

// Fungsi untuk menambah program baru
export const createProgram = async (programData) => {
  try {
    const token = localStorage.getItem('token');
    const company_id = getCompanyIdFromToken() || localStorage.getItem('id_company');
    console.log('Company ID dari JWT:', company_id);
    console.log('Data yang diterima dari form:', programData);
    
    // Validasi data yang diperlukan
    if (!programData.title || !programData.company_name || !programData.description || 
        !programData.category || !programData.location || !programData.duration || 
        !programData.start_date || !programData.end_date || !programData.quota || 
        !programData.qualification || !programData.benefits || !programData.id_mentor) {
      throw new Error('Semua field wajib diisi kecuali foto');
    }
    
    if (!company_id) {
      throw new Error('Company ID tidak ditemukan. Silakan login ulang.');
    }
    
    // Struktur data program sesuai format yang diminta (persis seperti Postman)
    const data = {
      title: programData.title.trim(),
      company_name: programData.company_name.trim(),
      description: programData.description.trim(),
      category: programData.category.trim(),
      location: programData.location.trim(),
      intern_type: programData.intern_type,
      duration: programData.duration.trim(),
      start_date: programData.start_date,
      end_date: programData.end_date,
      quota: parseInt(programData.quota),
      status: programData.status,
      qualification: programData.qualification.trim(),
      benefits: programData.benefits.trim(),
      id_mentor: programData.id_mentor,
      id_company: company_id
    };
    
    // Tambahkan photo hanya jika ada
    if (programData.photo) {
      data.photo = programData.photo;
    }
    
    const response = await axios.post(`${API_BASE_URL}/api/programs`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating program:', error.response?.data || error);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.response?.data?.message);
    console.error('Full error response:', error.response);
    throw error.response?.data || error;
  }
};

// Fungsi untuk get semua program
export const getPrograms = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Fetching programs...');
    
    const response = await axios.get(`${API_BASE_URL}/api/programs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    
    console.log('API Response:', response.data);
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    console.error('Error fetching programs:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Fungsi untuk get program by id
export const getProgramById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/programs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk update program
export const updateProgram = async (id, programData) => {
  try {
    const token = localStorage.getItem('token');
    const company_id = getCompanyIdFromToken() || localStorage.getItem('id_company');
    console.log('Company ID dari JWT:', company_id);
    console.log('Data yang akan diupdate:', programData);
    
    // Validasi data yang diperlukan
    if (!programData.title || !programData.company_name || !programData.description || 
        !programData.category || !programData.location || !programData.duration || 
        !programData.start_date || !programData.end_date || !programData.quota || 
        !programData.qualification || !programData.benefits || !programData.id_mentor) {
      throw new Error('Semua field wajib diisi kecuali foto');
    }
    
    if (!company_id) {
      throw new Error('Company ID tidak ditemukan. Silakan login ulang.');
    }
    
    // Struktur data program sesuai format yang diminta (persis seperti Postman)
    const data = {
      title: programData.title.trim(),
      company_name: programData.company_name.trim(),
      description: programData.description.trim(),
      category: programData.category.trim(),
      location: programData.location.trim(),
      intern_type: programData.intern_type,
      duration: programData.duration.trim(),
      start_date: programData.start_date,
      end_date: programData.end_date,
      quota: parseInt(programData.quota),
      status: programData.status,
      qualification: programData.qualification.trim(),
      benefits: programData.benefits.trim(),
      id_mentor: programData.id_mentor,
      id_company: company_id
    };
    
    // Tambahkan photo hanya jika ada
    if (programData.photo) {
      data.photo = programData.photo;
    }
        
    const response = await axios.put(`${API_BASE_URL}/api/programs/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating program:', error.response?.data || error);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.response?.data?.message);
    console.error('Full error response:', error.response);
    throw error.response?.data || error;
  }
};

// Fungsi untuk hapus program
export const deleteProgram = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/api/programs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 8000 // 8 detik timeout
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting program:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengambil semua aplikasi program milik company
export const getApplicationsCompany = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/companies/applications?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk update status aplikasi
export const updateApplicationStatus = async (id, status, feedback = '') => {
  try {
    const token = localStorage.getItem('token');
    const data = {
      status: status,
      feedback: feedback
    };
    
    const response = await axios.put(`${API_BASE_URL}/api/companies/applications/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};



