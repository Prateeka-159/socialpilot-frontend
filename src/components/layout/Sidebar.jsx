import {
  LayoutDashboard,
  User,
  BarChart3,
  Settings,
  Link2,
  Calendar,
  LogOut,
  FileText,
  ListOrdered,
  Megaphone
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Social Accounts", path: "/social-accounts", icon: <Link2 size={18} /> },
    { name: "Scheduler", path: "/scheduler", icon: <Calendar size={18} /> },
    { name: "Drafts", path: "/drafts", icon: <FileText size={18} /> },
    { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
    { name: "Queue", path: "/queue", icon: <ListOrdered size={18} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={18} /> },
    { name: "Campaigns", path: "/campaigns", icon: <Megaphone size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="sp-sidebar">
      <div className="sidebar-header">
        <Logo variant="light" />
      </div>

      <div className="sidebar-section-label">NAVIGATION</div>

      <nav className="sidebar-nav">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="link-icon">{item.icon}</span>
            <span className="link-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-strip">
          <img
            src="/images.jpg"
            alt="User avatar"
            className="user-avatar-img"
          />
          <div className="user-meta">
            <span className="user-name">Alex Vance</span>
            <span className="user-role">Head of Social</span>
          </div>
        </div>

        <button className="logout-trigger" onClick={handleLogout} title="Sign Out">
          <LogOut size={16} />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;