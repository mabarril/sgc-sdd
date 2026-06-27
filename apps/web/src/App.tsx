import { useState, useEffect } from 'react';
import { api } from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import ClubRegistration from './pages/ClubRegistration';
import Dashboard from './pages/Dashboard';

type View = 'loading' | 'login' | 'register' | 'club-registration' | 'dashboard';

export default function App() {
  const [view, setView] = useState<View>('loading');
  const [club, setClub] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Initial load: check auth token and load club state
  useEffect(() => {
    async function checkAuth() {
      const token = api.getToken();
      if (!token) {
        setView('login');
        return;
      }

      try {
        const clubData = await api.getClub();
        setClub(clubData);
        setView('dashboard');
      } catch (err: any) {
        // If no club registered (HTTP 404), redirect to registration form
        if (err.message.includes('Nenhum clube cadastrado')) {
          setView('club-registration');
        } else {
          // Token expired or invalid, reset state
          api.clearToken();
          setView('login');
        }
      }
    }
    checkAuth();
  }, []);

  const handleLoginSuccess = async () => {
    setView('loading');
    try {
      const clubData = await api.getClub();
      setClub(clubData);
      setView('dashboard');
    } catch (err: any) {
      if (err.message.includes('Nenhum clube cadastrado')) {
        setView('club-registration');
      } else {
        api.clearToken();
        setView('login');
      }
    }
  };

  const handleRegisterSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setView('login');
  };

  const handleClubRegistrationSuccess = (registeredClub: any) => {
    setClub(registeredClub);
    setView('dashboard');
  };

  const handleLogout = () => {
    api.clearToken();
    localStorage.removeItem('sgc_user');
    setClub(null);
    setView('login');
  };

  if (view === 'loading') {
    return (
      <div className="full-screen-center">
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid rgba(99, 102, 241, 0.1)',
            borderTop: '4px solid var(--accent-primary)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem auto'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ color: 'var(--text-secondary)' }}>Carregando dados do sistema...</p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <>
        {successMessage && (
          <div className="container" style={{ maxWidth: '440px', paddingBottom: 0 }}>
            <div className="alert alert-success" style={{ marginBottom: 0, marginTop: '2rem' }}>
              {successMessage}
            </div>
          </div>
        )}
        <Login
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => {
            setSuccessMessage('');
            setView('register');
          }}
        />
      </>
    );
  }

  if (view === 'register') {
    return (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onNavigateToLogin={() => setView('login')}
      />
    );
  }

  if (view === 'club-registration') {
    return (
      <ClubRegistration
        onRegistrationSuccess={handleClubRegistrationSuccess}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'dashboard' && club) {
    return (
      <Dashboard
        club={club}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}
