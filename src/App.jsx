import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { styled } from './stitches.config.js';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import AuthPage from './pages/AuthPage';

// Custom Stitches loading container
const LoadingContainer = styled('div', {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$bg',
  color: '$accent',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  fontFamily: 'system-ui, sans-serif'
});

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (error) {
    return (
      <LoadingContainer style={{ color: '#EF4444', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
        <div>Authentication Error</div>
        <div style={{ fontSize: '1rem', marginTop: '10px', color: '#94A3B8' }}>{error.message}</div>
      </LoadingContainer>
    );
  }

  if (isLoading) {
    return (
      <LoadingContainer>
        Loading DevSup...
      </LoadingContainer>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!isAuthenticated ? <Home /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/setup" 
          element={isAuthenticated ? <ProfileSetup /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;