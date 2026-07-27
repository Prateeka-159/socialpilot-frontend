import { useState } from 'react';
import Login from './pages/Login/Login';       // Adjust file name if different
import Profile from './pages/Profile/Profile';   // Adjust file name if different
import Settings from './pages/Settings/Settings'; // Adjust file name if different

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <div>
      {/* Top Navigation Bar to switch views */}
      <nav style={styles.nav}>
        <button 
          onClick={() => setCurrentPage('login')}
          style={currentPage === 'login' ? styles.activeBtn : styles.btn}
        >
          Login Page
        </button>
        <button 
          onClick={() => setCurrentPage('profile')}
          style={currentPage === 'profile' ? styles.activeBtn : styles.btn}
        >
          Profile
        </button>
        <button 
          onClick={() => setCurrentPage('settings')}
          style={currentPage === 'settings' ? styles.activeBtn : styles.btn}
        >
          Settings
        </button>
      </nav>

      {/* Render Current Page */}
      {currentPage === 'login' && <Login />}
      {currentPage === 'profile' && <Profile />}
      {currentPage === 'settings' && <Settings />}
    </div>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: 1000,
    display: 'flex',
    gap: '8px',
    background: 'rgba(18, 18, 30, 0.8)',
    padding: '8px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  btn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
    fontWeight: '600',
  },
  activeBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#00f2fe',
    color: '#0a0a12',
    cursor: 'pointer',
    fontWeight: '700',
  },
};