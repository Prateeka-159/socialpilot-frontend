import React, { useState } from "react";
import {
  Lock,
  Bell,
  Trash2,
  LogOut,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to purge this studio workspace?")) {
      navigate("/");
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="page-header hairline-b">
        <div>
          <span className="eyebrow-text font-mono">SYSTEM PREFERENCES</span>
          <h1 className="page-title font-serif">Workspace Configuration</h1>
          <p className="page-subtitle">
            Configure security protocols, API sync behavior, and notification dispatch settings.
          </p>
        </div>

        <div className="status-indicator font-mono">
          <span>SYSTEM VERSION: SP-v1.2.0</span>
        </div>
      </div>

      {/* Settings Flat List (NO BOX CARDS!) */}
      <div className="settings-flat-list">
        {/* Item 1 */}
        <div className="setting-flat-row hairline-b">
          <div className="setting-meta">
            <Lock size={20} className="setting-icon" />
            <div className="setting-titles">
              <h3 className="setting-name">Security Password</h3>
              <p className="setting-desc">Update your workspace authentication credentials.</p>
            </div>
          </div>
          <div className="setting-action">
            <button
              className="sp-setting-btn sp-setting-btn-outline"
              onClick={() => alert("Password reset link generated.")}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Item 2 */}
        <div className="setting-flat-row hairline-b">
          <div className="setting-meta">
            <Bell size={20} className="setting-icon" />
            <div className="setting-titles">
              <h3 className="setting-name">Email & Push Notifications</h3>
              <p className="setting-desc">Receive real-time alerts when scheduled posts publish or fail.</p>
            </div>
          </div>
          <div className="setting-action">
            <button
              className={`sp-setting-btn toggle-switch-btn ${notifications ? "active" : ""}`}
              onClick={() => setNotifications(!notifications)}
            >
              <span className="toggle-slider font-mono">
                {notifications ? "ENABLED" : "DISABLED"}
              </span>
            </button>
          </div>
        </div>

        {/* Item 3 */}
        <div className="setting-flat-row hairline-b">
          <div className="setting-meta">
            <Sliders size={20} className="setting-icon" />
            <div className="setting-titles">
              <h3 className="setting-name">Automatic API Pipeline Sync</h3>
              <p className="setting-desc">Fetch analytics and audience metric updates in 15-minute background loops.</p>
            </div>
          </div>
          <div className="setting-action">
            <button
              className={`sp-setting-btn toggle-switch-btn ${autoSync ? "active" : ""}`}
              onClick={() => setAutoSync(!autoSync)}
            >
              <span className="toggle-slider font-mono">
                {autoSync ? "ENABLED" : "DISABLED"}
              </span>
            </button>
          </div>
        </div>

        {/* Item 4 */}
        <div className="setting-flat-row hairline-b">
          <div className="setting-meta">
            <ShieldCheck size={20} className="setting-icon" />
            <div className="setting-titles">
              <h3 className="setting-name">Privacy & Data Governance</h3>
              <p className="setting-desc">Review API OAuth scopes, workspace permissions, and audit logs.</p>
            </div>
          </div>
          <div className="setting-action">
            <button className="sp-setting-btn sp-setting-btn-outline">
              Permissions
            </button>
          </div>
        </div>

        {/* Item 5 */}
        <div className="setting-flat-row hairline-b">
          <div className="setting-meta">
            <LogOut size={20} className="setting-icon" />
            <div className="setting-titles">
              <h3 className="setting-name">Terminate Active Session</h3>
              <p className="setting-desc">Sign out of the current administrative studio workspace session.</p>
            </div>
          </div>
          <div className="setting-action">
            <button className="sp-setting-btn sp-setting-btn-solid" onClick={handleLogout}>
              Sign Out Session
            </button>
          </div>
        </div>

        {/* Item 6: Purge Workspace */}
        <div className="setting-flat-row hairline-b danger-row">
          <div className="setting-meta">
            <Trash2 size={20} className="setting-icon danger-icon" />
            <div className="setting-titles">
              <h3 className="setting-name">Purge Workspace Data</h3>
              <p className="setting-desc">Permanently remove connected platforms, queued media, and metrics.</p>
            </div>
          </div>
          <div className="setting-action">
            <button
              className="sp-setting-btn danger-btn font-mono"
              onClick={handleDelete}
            >
              PURGE DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;