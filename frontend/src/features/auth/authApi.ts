import axiosInstance from '../../api/axiosConfig';
import { LoginRequest, RegisterRequest, AuthResponse, User } from './types';

export const login = async (loginData: LoginRequest): Promise<{ accessToken: string; user: User }> => {
  try {
    console.log('Login request data:', loginData);
    
    console.log('Sending request to:', `${axiosInstance.defaults.baseURL}/auth/login`);
    
    const response = await axiosInstance.post<AuthResponse>('/auth/login', loginData);
    console.log('Login response status:', response.status);
    console.log('Login response headers:', response.headers);
    console.log('Login response data:', response.data);
    
    if (!response.data) {
      console.error('Empty response data');
      throw new Error('Empty response received from server');
    }
    
    const accessToken = response.data.access_token || response.data.accessToken;
    const user = response.data.user;
    
    if (!accessToken) {
      console.error('No access token in response:', response.data);
      throw new Error('No access token in response');
    }
    
    if (!user) {
      console.error('No user data in response:', response.data);
      throw new Error('No user data in response');
    }
    
    console.log('Extracted token:', accessToken.substring(0, 15) + '...');
    console.log('Extracted user:', user);
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    console.log('Stored auth data in localStorage');
    
    return {
      accessToken,
      user,
    };
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error('Invalid email or password');
      } else if (status === 400) {
        throw new Error(error.response.data.message || 'Invalid input data');
      } else if (status === 500) {
        throw new Error('Server error. Please try again later');
      }
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Login failed');
  }
};

export const register = async (registerData: RegisterRequest): Promise<{ accessToken: string; user: User }> => {
  try {
    console.log('Register request data:', registerData);
    const response = await axiosInstance.post<AuthResponse>('/auth/register', registerData);
    console.log('Register response:', response.data);
    
    const accessToken = response.data.access_token || response.data.accessToken;
    const user = response.data.user;
    
    if (!accessToken || !user) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from server');
    }
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
      accessToken,
      user,
    };
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message);
    
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      throw new Error('Email already in use. Please use a different email address.');
    }
    
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  console.log('Logged out, cleared localStorage auth data');
};