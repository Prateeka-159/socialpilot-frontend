import {
  LayoutDashboard,
  User,
  BarChart3,
  Settings,
  Link2,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Social Accounts", path: "/social-accounts", icon: <Link2 size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>SocialPilot</h2>
      </div>

      <div className="menu">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="logout">
        <LogOut size={20} />
        <span>Logout</span>
      </div>
    </aside>
  );
}

export default Sidebar;