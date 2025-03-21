import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { checkBackendConnection, testAuthEndpoints } from './utils/backendChecker';
import './index.css';

console.log('App initializing...');

// Check if localStorage is working correctly
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage is working');
} catch (e) {
  console.error('localStorage is not available:', e);
}

// Check if the backend is reachable
Promise.all([
  checkBackendConnection(),
  testAuthEndpoints()
])
  .then(([isConnected, authEndpointsStatus]) => {
    console.log('Backend connectivity check result:', isConnected);
    console.log('Auth endpoints status:', authEndpointsStatus.message);
    
    if (!isConnected) {
      // Display a more visible connection error in the console
      console.error('==============================================');
      console.error('BACKEND CONNECTION ERROR');
      console.error('==============================================');
      console.error('Unable to connect to backend server on port 5000.');
      console.error('Please ensure that:');
      console.error('1. The backend server is running (npm run start:dev in the backend directory)');
      console.error('2. The backend is running on port 5000');
      console.error('3. There are no firewall or network issues blocking the connection');
      console.error('==============================================');
      
      // You could also display a UI notification here if needed
    }
  })
  .catch(error => {
    console.error('Error during backend connectivity check:', error);
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

console.log('App rendered');