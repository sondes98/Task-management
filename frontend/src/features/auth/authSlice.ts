import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './types';
import { logout } from './authApi';

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  try {
    console.log('Loading auth state from localStorage');
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    console.log('Stored token exists:', !!storedToken);
    console.log('Stored user exists:', !!storedUser);
    
    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        console.log('Successfully parsed user from localStorage');
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('user');
      }
    }
    
    return {
      accessToken: storedToken || null,
      user: parsedUser,
    };
  } catch (e) {
    console.error('Error loading auth state from localStorage:', e);
    return {
      accessToken: null,
      user: null,
    };
  }
};

const initialState: AuthState = getInitialState();
console.log('Initial auth state:', initialState);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
      console.log('Setting auth state:', action.payload);
      
      // Validate that we have both token and user
      if (!action.payload.accessToken) {
        console.error('Attempted to set auth state with missing accessToken');
        return;
      }
      
      if (!action.payload.user) {
        console.error('Attempted to set auth state with missing user data');
        return;
      }
      
      // Update the state
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      
      try {
        // Ensure localStorage is updated
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        console.log('Successfully stored auth data in localStorage');
      } catch (e) {
        console.error('Failed to store auth data in localStorage:', e);
      }
    },
    clearAuth: (state) => {
      console.log('Clearing auth state');
      // Call the logout function to clear localStorage
      logout();
      
      // Update state
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;