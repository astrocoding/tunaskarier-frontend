import axios from 'axios';

const API_BASE_URL = 'http://159.223.59.60';

// Fungsi untuk login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    // Handle error response structure
    if (error.response?.data) {
      // Return the error message from API response
      throw new Error(error.response.data.message || 'Login gagal');
    } else if (error.message) {
      // Handle network or other errors
      throw new Error(error.message);
    } else {
      // Fallback error
      throw new Error('Terjadi kesalahan pada server');
    }
  }
};

// Fungsi untuk register


// Fungsi untuk mengambil profil user
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
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

// Fungsi untuk register siswa
export const registerStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register/student`, studentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fungsi untuk update profile user
export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData, {
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

// Fungsi untuk update profile company
export const updateCompanyProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Struktur data yang sesuai untuk company profile - hanya field yang bisa diedit
    const companyData = {
      full_name: profileData.company_name, // Menggunakan full_name untuk nama perusahaan
      phone_number: profileData.company_phone, // Menggunakan phone_number untuk telepon
      photo: profileData.company_logo, // Menggunakan photo untuk logo
      company_name: profileData.company_name,
      company_address: profileData.company_address,
      company_email: profileData.company_email,
      company_website: profileData.company_website,
      company_description: profileData.company_description
    };
    
    const response = await axios.put(`${API_BASE_URL}/users/profile`, companyData, {
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

// Fungsi untuk update password user
export const updatePassword = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/users/password`, data, {
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

