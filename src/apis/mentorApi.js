import axios from 'axios';

const API_BASE_URL = 'https://159.223.59.60';

// Get programs assigned to mentor
export const getMentorPrograms = async (page = 1, limit = 6) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/programs/mentor`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page,
        limit
      },
      timeout: 8000 // 8 detik timeout
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};

// Get students assigned to mentor
export const getMentorStudents = async (page = 1, limit = 6) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/students/mentor`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page,
        limit
      },
      timeout: 8000 // 8 detik timeout
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};

// Get student by ID
export const getStudentById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/students/mentor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 8000 // 8 detik timeout
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};

// Create assessment
export const createAssessment = async (assessmentData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_BASE_URL}/api/assessments`, assessmentData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 8000 // 8 detik timeout
    });
    
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};

// Get assessments list
export const getAssessments = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/assessments`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page,
        limit
      },
      timeout: 8000 // 8 detik timeout
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};

// Get assessment by ID
export const getAssessmentById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/api/assessments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 8000 // 8 detik timeout
    });
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};

// Update assessment
export const updateAssessment = async (id, assessmentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/api/assessments/${id}`, assessmentData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 8000 // 8 detik timeout
    });
    
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};

// Delete assessment
export const deleteAssessment = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/api/assessments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 8000 // 8 detik timeout
    });
    
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Silakan coba lagi.');
    }
    throw error.response?.data || error;
  }
};
