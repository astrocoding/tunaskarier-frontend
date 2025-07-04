import axios from 'axios';

const API_BASE_URL = 'http://159.223.59.60';

// Helper function for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ========== ADMIN MANAGEMENT FUNCTIONS ==========

// Fungsi untuk mengambil semua data admin
export const getAllAdmins = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_BASE_URL}/api/admins?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk menambah admin baru
export const createAdmin = async (adminData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/admins`, adminData, {
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

// Fungsi untuk mengedit admin (PUT /api/admins/{id})
export const updateAdmin = async (id, adminData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/api/admins/${id}`, adminData, {
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

// Fungsi untuk menghapus admin
export const deleteAdmin = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/api/admins/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengambil detail admin berdasarkan ID
export const getAdminById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/admins/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== STUDENT MANAGEMENT FUNCTIONS ==========

// Fungsi untuk mengambil semua data student dengan pagination
export const getAllStudents = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/students?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk menambah student baru
export const createStudent = async (studentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/students`, studentData, {
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

// Fungsi untuk mengedit student (PUT /api/students/{id})
export const updateStudent = async (id, studentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/api/students/${id}`, studentData, {
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

// Fungsi untuk menghapus student
export const deleteStudent = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/api/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengambil detail student berdasarkan ID
export const getStudentById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== COMPANY MANAGEMENT FUNCTIONS ==========

// Fungsi untuk mengambil semua data company
export const getAllCompanies = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/companies?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk menambah company baru
export const createCompany = async (companyData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/companies`, companyData, {
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

// Fungsi untuk mengedit company (PUT /api/companies/{id})
export const updateCompany = async (id, companyData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/api/companies/${id}`, companyData, {
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

// Fungsi untuk menghapus company
export const deleteCompany = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/api/companies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengambil detail company berdasarkan ID
export const getCompanyById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/companies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== MENTOR MANAGEMENT FUNCTIONS ==========

// Fungsi untuk mengambil semua data mentor
export const getAllMentors = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/mentors?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengambil detail mentor berdasarkan ID
export const getMentorById = async (mentorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/mentors/${mentorId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengedit mentor (PUT /api/mentors/{mentorId})
export const updateMentor = async (mentorId, mentorData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/api/mentors/${mentorId}`, mentorData, {
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

// Fungsi untuk menghapus mentor
export const deleteMentor = async (mentorId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/api/mentors/${mentorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk menambah mentor baru
export const createMentor = async (mentorData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/mentors`, mentorData, {
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

// ========== PROGRAM MANAGEMENT FUNCTIONS ==========

// Fungsi untuk mengambil semua data program
export const getAllPrograms = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/programs?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengambil detail program berdasarkan ID
export const getProgramById = async (programId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/programs/${programId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== APPLICATION MANAGEMENT FUNCTIONS ==========

// Fungsi untuk mengambil semua data aplikasi
export const getAllApplications = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/applications?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk mengambil detail aplikasi berdasarkan ID
export const getApplicationById = async (applicationId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/applications/${applicationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== DASHBOARD FUNCTIONS ==========

// Fungsi untuk mengambil data dashboard
export const getDashboardData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/admins/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};