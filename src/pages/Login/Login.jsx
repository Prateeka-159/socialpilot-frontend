import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);
  };

  return (
    <div style={styles.container}>
      {/* Dynamic Background Effects */}
      <div style={styles.bgGlowTop}></div>
      <div style={styles.bgGlowBottom}></div>

      {/* Glassmorphism Login Card */}
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>SocialPilot</h1>
          <p style={styles.subtitle}>Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused({ ...isFocused, email: true })}
              onBlur={() => setIsFocused({ ...isFocused, email: false })}
              style={{
                ...styles.input,
                borderColor: isFocused.email ? '#00f2fe' : 'rgba(255, 255, 255, 0.15)',
                boxShadow: isFocused.email ? '0 0 12px rgba(0, 242, 254, 0.4)' : 'none',
              }}
              required
            />
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocused({ ...isFocused, password: true })}
              onBlur={() => setIsFocused({ ...isFocused, password: false })}
              style={{
                ...styles.input,
                borderColor: isFocused.password ? '#00f2fe' : 'rgba(255, 255, 255, 0.15)',
                boxShadow: isFocused.password ? '0 0 12px rgba(0, 242, 254, 0.4)' : 'none',
              }}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={styles.optionsRow}>
            <label style={styles.rememberMe}>
              <input type="checkbox" style={{ marginRight: '8px', accentColor: '#00f2fe' }} />
              Remember me
            </label>
            <a href="#forgot" style={styles.forgotLink}>Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <a href="#signup" style={styles.signupLink}>Sign up</a>
        </p>
      </div>
    </div>
  );
}

// Inline Styles for Modern Cyberpunk / Dark Glass Aesthetics
const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a12',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflow: 'hidden',
    boxSizing: 'border-box',
    margin: 0,
    padding: '20px',
  },
  bgGlowTop: {
    position: 'absolute',
    top: '-150px',
    left: '-150px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 242, 254, 0.35) 0%, rgba(0, 0, 0, 0) 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  bgGlowBottom: {
    position: 'absolute',
    bottom: '-150px',
    right: '-150px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79, 172, 254, 0.35) 0%, rgba(0, 0, 0, 0) 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '420px',
    padding: '40px 32px',
    background: 'rgba(18, 18, 30, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 2px rgba(255, 255, 255, 0.2)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #00f2fe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '8px 0 0 0',
    fontSize: '14px',
    color: '#94a3b8',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#cbd5e1',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    outline: 'none',
    color: '#ffffff',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
  },
  rememberMe: {
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  forgotLink: {
    color: '#00f2fe',
    textDecoration: 'none',
    fontWeight: '500',
  },
  button: {
    marginTop: '10px',
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    color: '#0a0a12',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0, 242, 254, 0.3)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  footerText: {
    marginTop: '28px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#94a3b8',
  },
  signupLink: {
    color: '#00f2fe',
    textDecoration: 'none',
    fontWeight: '600',
  },
};