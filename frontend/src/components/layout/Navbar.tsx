import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { clearAuth } from '../../features/auth/authSlice';
import { AuthState } from '../../features/auth/types';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state: RootState) => state.auth as AuthState);
  const isAuthenticated = !!accessToken && !!user;

  useEffect(() => {
    // Check if token exists in localStorage but not in Redux
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken && !accessToken) {
      console.log('Token exists in localStorage but not in Redux state, page might have been refreshed');
    }
  }, [accessToken]);

  const handleLogout = () => {
    console.log('Logging out user');
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        
        {isAuthenticated ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              {user && (
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Welcome, {user.name}
                </Typography>
              )}
            </Box>
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate('/task-form')}>
              Add Task
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;