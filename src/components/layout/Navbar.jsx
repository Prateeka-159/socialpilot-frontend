import { Bell, Search, UserCircle } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="nav-right">
        <Bell className="icon" size={22} />

        <div className="profile">
          <UserCircle size={28} />
          <div>
            <h4>Admin</h4>
            <small>Administrator</small>
          </div>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;