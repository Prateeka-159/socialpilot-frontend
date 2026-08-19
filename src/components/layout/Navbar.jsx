import React, { useState } from "react";
import { Search, Bell, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="sp-navbar">
      <div className="nav-left">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search campaigns, metrics, posts..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
          {searchValue && (
            <button className="clear-search" onClick={() => setSearchValue("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="nav-right">
        <button
          className="nav-action-btn"
          onClick={() => navigate("/scheduler")}
          title="New Post"
        >
          <Sparkles size={15} />
          <span>New Post</span>
        </button>

        <button
          className="nav-icon-btn"
          onClick={() => navigate("/settings")}
          title="Notifications"
        >
          <Bell size={18} />
          <span className="notif-badge"></span>
        </button>

        <button
          className="nav-icon-btn"
          onClick={() => navigate("/settings")}
          title="Settings"
        >
          <Settings size={18} />
        </button>

        <div className="nav-divider"></div>

        <div className="nav-user-preview" onClick={() => navigate("/profile")}>
          <img
            src="/images.jpg"
            alt="Alex Vance"
            className="nav-avatar-img"
          />
          <span className="nav-user-name">{user?.name?.split(" ")[0] || "User"}</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;