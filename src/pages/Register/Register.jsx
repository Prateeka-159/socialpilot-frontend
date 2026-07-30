import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, User, ShieldCheck } from "lucide-react";
import Logo from "../../components/common/Logo";
import "../Login/Login.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-canvas">
      {/* Visual Photography Column */}
      <div className="login-visual-pane">
        <img
          src="/ripples-of-sand-in-black-and-white.jpg"
          alt="Ripples of sand editorial visual"
          className="pane-hero-img"
        />
        <div className="visual-overlay-shade"></div>

        <div className="visual-top-bar">
          <Logo variant="light" size="large" />
        </div>

        <div className="visual-quote-container">
          <span className="quote-tag">STUDIO ONBOARDING</span>
          <h2 className="quote-heading font-serif">
            "Architect your social narrative with precision, rhythm, and editorial clarity."
          </h2>
          <div className="quote-author font-mono">
            <span>STUDIO PARADIGM</span> — <span>NEW WORKSPACE</span>
          </div>
        </div>
      </div>

      {/* Form Pane */}
      <div className="login-form-pane">
        <div className="form-inner">
          <div className="form-header">
            <span className="form-eyebrow font-mono">CREATE ACCOUNT</span>
            <h1 className="form-title font-serif">Join the SP Suite</h1>
            <p className="form-subtext">
              Set up your workspace to schedule, organize, and analyze your brand's presence.
            </p>
          </div>

          <form className="sp-minimal-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label font-mono">FULL NAME</label>
              <div className="input-hairline-box">
                <User size={16} className="field-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bare-input"
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label font-mono">WORK EMAIL</label>
              <div className="input-hairline-box">
                <Mail size={16} className="field-icon" />
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bare-input"
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label font-mono">CHOOSE PASSWORD</label>
              <div className="input-hairline-box">
                <Lock size={16} className="field-icon" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bare-input"
                />
              </div>
            </div>

            <button type="submit" className="sp-primary-submit">
              <span>Create Workspace</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="form-footer-strip hairline-t">
            <span className="footer-prompt">Already have a studio workspace?</span>
            <Link to="/" className="register-link font-mono">
              SIGN IN TO EXISTING SESSION →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;