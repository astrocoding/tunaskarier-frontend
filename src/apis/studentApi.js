const BASE_URL = 'https://159.223.59.60/api';

export const getAvailablePrograms = async (page = 1, limit = 6) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: 'open'
    });

    const response = await fetch(`${BASE_URL}/students/programs?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch programs');
    }

    const result = await response.json();
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return result;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
};

// Search available programs with real-time functionality
export const searchAvailablePrograms = async (searchTerm, page = 1, limit = 6) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: 'open', // Only show open programs
      search: searchTerm
    });

    const response = await fetch(`${BASE_URL}/students/programs?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to search programs');
    }

    const result = await response.json();
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return result;
  } catch (error) {
    console.error('Error searching programs:', error);
    throw error;
  }
};

// Get program detail for student
export const getStudentProgramDetail = async (programId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/students/programs/${programId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch program detail');
    }
    const result = await response.json();
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return result;
  } catch (error) {
    console.error('Error fetching program detail:', error);
    throw error;
  }
};

// Apply to a program
export const applyToProgram = async (programId, applicationData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(applicationData)
    });

    if (!response.ok) {
      throw new Error('Failed to apply to program');
    }

    const result = await response.json();
    
    // Handle the correct API response structure
    // API returns: { status, message, data: { application } }
    if (result.status === 'success' && result.data) {
      return result;
    }
    
    return result;
  } catch (error) {
    console.error('Error applying to program:', error);
    throw error;
  }
};

// Get applied programs for student
export const getAppliedPrograms = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await fetch(`${BASE_URL}/students/applications?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applied programs');
    }

    const result = await response.json();
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return result;
  } catch (error) {
    console.error('Error fetching applied programs:', error);
    throw error;
  }
};

// Get assessments for student
export const getAssessments = async (page = 1, limit = 6) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await fetch(`${BASE_URL}/assessments?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assessments');
    }

    const result = await response.json();
    
    // Return the exact API response structure
    // API returns: { status, message, data: [...], pagination: {...} }
    return result;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }
};

// Get assessment detail for student
export const getAssessmentById = async (assessmentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/assessments/${assessmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch assessment detail');
    }
    
    const result = await response.json();
    
    // Return the exact API response structure
    // API returns: { status, message, data: {...} }
    return result;
  } catch (error) {
    console.error('Error fetching assessment detail:', error);
    throw error;
  }
};
