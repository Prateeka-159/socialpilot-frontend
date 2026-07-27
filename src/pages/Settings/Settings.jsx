import { useState } from 'react';

export default function AccountManagement() {
  const [formData, setFormData] = useState({
    username: 'Alex Johnson',
    currentPassword: '',
    newPassword: '',
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Account settings saved:', formData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Account Settings</h2>
        
        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Display Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          <div style={styles.checkboxRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              Enable Email Notifications
            </label>
          </div>

          <button type="submit" style={styles.button}>Save Changes</button>
        </form>
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
    maxWidth: '500px',
    background: 'rgba(18, 18, 30, 0.75)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  title: { margin: '0 0 24px', fontSize: '24px', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#cbd5e1' },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  checkboxRow: { margin: '8px 0' },
  checkboxLabel: { fontSize: '14px', color: '#94a3b8', cursor: 'pointer' },
  button: {
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
    color: '#0a0a12',
    fontWeight: '700',
    cursor: 'pointer',
  },
};