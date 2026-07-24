import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/dashboard">Dashboard</Link>

      <Link to="/campaigns">Campaigns</Link>

      <Link to="/scheduler">Scheduler</Link>

      <Link to="/analytics">Analytics</Link>

      <Link to="/profile">Profile</Link>

      <Link to="/settings">Settings</Link>
    </aside>
  );
}

export default Sidebar;