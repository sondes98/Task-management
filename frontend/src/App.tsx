import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AppRoutes from './routes';
import { theme } from './theme/theme';

const App: React.FC = () => {
  const toggleSidebar = () => {
    // Add sidebar toggle logic if needed
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar toggleSidebar={toggleSidebar} />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;