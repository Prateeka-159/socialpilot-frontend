import { useState } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'Frontend Developer',
    bio: 'Building modern web apps with React and Vite.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img src={user.avatar} alt="Avatar" style={styles.avatar} />
          <h2 style={styles.title}>{user.name}</h2>
          <p style={styles.role}>{user.role}</p>
        </div>

        <div style={styles.infoSection}>
          <div style={styles.infoRow}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{user.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Bio:</span>
            <span style={styles.value}>{user.bio}</span>
          </div>
        </div>

        <button style={styles.button}>Edit Profile</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a12',
    color: '#ffffff',
    fontFamily: 'sans-serif',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(18, 18, 30, 0.75)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  header: { textAlign: 'center', marginBottom: '24px' },
  avatar: { width: '96px', height: '96px', borderRadius: '50%', marginBottom: '12px' },
  title: { margin: 0, fontSize: '24px', fontWeight: '700' },
  role: { margin: '4px 0 0', color: '#00f2fe', fontSize: '14px' },
  infoSection: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' },
  infoRow: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' },
  value: { fontSize: '15px', color: '#f8fafc' },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
    color: '#0a0a12',
    fontWeight: '700',
    cursor: 'pointer',
  },
};