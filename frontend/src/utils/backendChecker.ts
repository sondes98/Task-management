import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// This function checks if the backend is reachable
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking backend connection to:', API_URL);
    
    // First try a simple GET request to the API root
    const response = await axios.get(API_URL, { timeout: 5000 });
    console.log('Backend is reachable, response:', response.status);
    return true;
  } catch (error: any) {
    console.warn(`Backend connection to ${API_URL} failed:`, error.message);
    
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('NETWORK ERROR: The backend server is not running or not accessible on port 5000');
      console.error('Please ensure that:');
      console.error('1. The backend server is running (npm run start:dev in the backend directory)');
      console.error('2. The backend is running on port 5000');
      console.error('3. There are no firewall or network issues blocking the connection');
      return false;
    }
    
    // We got a response, but it wasn't what we expected
    console.warn('Backend returned an unexpected response');
    return false;
  }
};

// This function tests the auth endpoints specifically
export const testAuthEndpoints = async (): Promise<{
  authEndpointsExist: boolean;
  message: string;
}> => {
  try {
    console.log('Testing auth endpoints...');
    
    // Try sending an invalid login request to see if the endpoint exists
    // This should fail with 400 or 401, but that's expected
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com', 
      password: 'invalidpassword'
    }, { 
      timeout: 5000,
      validateStatus: (status) => status < 500 // Accept any non-server error response
    });
    
    console.log('Auth endpoint test response:', response.status, response.statusText);
    
    // If we get a 400 or 401, that's actually good - it means the endpoint exists
    if (response.status === 400 || response.status === 401) {
      return {
        authEndpointsExist: true,
        message: 'Auth endpoints are working correctly'
      };
    }
    
    // Otherwise, something unexpected happened
    return {
      authEndpointsExist: true,
      message: `Auth endpoints returned unexpected status: ${response.status}`
    };
  } catch (error: any) {
    console.error('Auth endpoint test error:', error.message);
    
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return {
        authEndpointsExist: false,
        message: 'Cannot connect to auth endpoints - network error'
      };
    }
    
    if (error.response) {
      // We got a response from the server, even if it's an error
      return {
        authEndpointsExist: true,
        message: `Auth endpoints exist but returned status: ${error.response.status}`
      };
    }
    
    return {
      authEndpointsExist: false,
      message: `Cannot test auth endpoints: ${error.message}`
    };
  }
}; 