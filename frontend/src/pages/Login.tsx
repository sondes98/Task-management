import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setAuth } from '../features/auth/authSlice';
import { login } from '../features/auth/authApi';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: async (values) => {
      try {
        setError(null);
        setDebugInfo(null);
        setIsSubmitting(true);
        
        console.log('Attempting login with:', values);
        // Add a slight delay to ensure the backend has time to process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = await login(values);
        console.log('Login successful, received result:', result);
        
        if (!result.accessToken) {
          setDebugInfo(JSON.stringify(result, null, 2));
          throw new Error('No access token received from server');
        }
        
        // Dispatch to Redux store
        dispatch(setAuth(result));
        
        // Navigate to dashboard on success
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Login failed with error:', err);
        
        // Try to provide a more specific error message
        if (err.response?.status === 401) {
          setError('Invalid email or password');
        } else if (err.message.includes('Network Error')) {
          setError('Unable to connect to server. Please check if the backend is running on port 5000.');
        } else {
          setError(err.message || 'Invalid email or password');
          
          // Add debug info for troubleshooting
          if (err.response?.data) {
            setDebugInfo(JSON.stringify(err.response.data, null, 2));
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {debugInfo && (
        <Alert severity="info" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          <Typography variant="subtitle2">Debug Info:</Typography>
          {debugInfo}
        </Alert>
      )}
      
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
          disabled={isSubmitting}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          fullWidth
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isSubmitting}
          sx={{ position: 'relative' }}
        >
          {isSubmitting ? (
            <>
              Logging in...
              <CircularProgress 
                size={24} 
                sx={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }} 
              />
            </>
          ) : 'Login'}
        </Button>
        <Button variant="text" onClick={() => navigate('/register')} disabled={isSubmitting}>
          Don't have an account? Register
        </Button>
      </Box>
    </Container>
  );
};

export default Login;