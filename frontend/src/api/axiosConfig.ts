import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Axios request:', { 
      url: config.url, 
      method: config.method, 
      headers: config.headers,
      data: config.data 
    });
    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios response:', { 
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    // Log full response structure (for debugging purposes)
    console.log('Full response JSON structure:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error('Axios response error:', { 
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message 
    });
    
    if (error.response?.data) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login if token is invalid
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 