import {
  Lock,
  Bell,
  Trash2,
  LogOut,
  Moon,
  ShieldCheck,
} from "lucide-react";
import "./Settings.css";

function Settings() {
  return (
    <div className="settings-page">

      <div className="settings-header">
        <h1>Account Management</h1>
        <p>Manage your account preferences and security.</p>
      </div>

      <div className="settings-grid">

        <div className="setting-card">
          <Lock size={28} />
          <div>
            <h3>Change Password</h3>
            <p>Update your account password securely.</p>
          </div>
          <button>Change</button>
        </div>

        <div className="setting-card">
          <Bell size={28} />
          <div>
            <h3>Notifications</h3>
            <p>Manage email and push notifications.</p>
          </div>
          <button>Manage</button>
        </div>

        <div className="setting-card">
          <Moon size={28} />
          <div>
            <h3>Appearance</h3>
            <p>Switch between light and dark mode.</p>
          </div>
          <button>Toggle</button>
        </div>

        <div className="setting-card">
          <ShieldCheck size={28} />
          <div>
            <h3>Privacy</h3>
            <p>Configure privacy and account security.</p>
          </div>
          <button>View</button>
        </div>

        <div className="setting-card">
          <LogOut size={28} />
          <div>
            <h3>Logout</h3>
            <p>Sign out from your current session.</p>
          </div>
          <button className="logout-btn">Logout</button>
        </div>

        <div className="setting-card danger">
          <Trash2 size={28} />
          <div>
            <h3>Delete Account</h3>
            <p>Permanently delete your account.</p>
          </div>
          <button className="delete-btn">Delete</button>
        </div>

      </div>

    </div>
  );
}

export default Settings;