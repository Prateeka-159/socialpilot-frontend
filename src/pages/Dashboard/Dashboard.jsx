import {
  Users,
  Link2,
  CalendarCheck,
  BarChart3,
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const stats = [
    {
      title: "Connected Accounts",
      value: "2",
      icon: <Link2 size={28} />,
    },
    {
      title: "Scheduled Posts",
      value: "18",
      icon: <CalendarCheck size={28} />,
    },
    {
      title: "Followers",
      value: "12.4K",
      icon: <Users size={28} />,
    },
    {
      title: "Engagement",
      value: "86%",
      icon: <BarChart3 size={28} />,
    },
  ];

  return (
    <div className="dashboard">

      <div className="welcome-card">
        <h1>Welcome Back 👋</h1>
        <p>
          Manage your social media accounts from one place.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <div className="stat-card" key={item.title}>
            <div className="icon">{item.icon}</div>

            <div>
              <h2>{item.value}</h2>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-grid">

        <div className="activity-card">
          <h2>Recent Activity</h2>

          <ul>
            <li>✅ LinkedIn account connected</li>
            <li>📅 Scheduled a Facebook post</li>
            <li>📈 Analytics updated</li>
            <li>👤 Profile edited</li>
          </ul>
        </div>

        <div className="platform-card">
          <h2>Connected Platforms</h2>

          <div className="platform">
            <span>🔵 LinkedIn</span>
            <span className="connected">Connected</span>
          </div>

          <div className="platform">
            <span>🟦 Facebook</span>
            <span className="disconnected">Not Connected</span>
          </div>

          <div className="platform">
            <span>📸 Instagram</span>
            <span className="disconnected">Not Connected</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;