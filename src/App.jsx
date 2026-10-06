import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { styled } from './stitches.config.js';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import AuthPage from './pages/AuthPage';

// Custom Stitches loading container
const LoadingContainer = styled('div', {
  height: '100vh',
  minHeight: '100dvh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$bg',
  color: '$accent',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  fontFamily: 'system-ui, sans-serif'
});

const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || '/dashboard', { replace: true });
  };

  if (!(domain && clientId)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://devsup-api"
      }}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

function AppRoutes() {
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
      {/* Catch-all route for any unmatched paths */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} 
      />
    </Routes>
  );
}
function App() {
  return (
    <Router>
      <Auth0ProviderWithNavigate>
        <AppRoutes />
      </Auth0ProviderWithNavigate>
    </Router>
  );
}

export default App;