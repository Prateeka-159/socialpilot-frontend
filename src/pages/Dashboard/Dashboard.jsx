import {
  Users,
  BarChart3,
  Activity,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "AGGREGATE AUDIENCE",
      value: "12.4K",
      change: "+14.2% growth",
      icon: <Users size={20} />,
    },
    {
      title: "AVERAGE ENGAGEMENT",
      value: "8.6%",
      change: "+1.8% benchmark",
      icon: <BarChart3 size={20} />,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      time: "10:42 AM",
      date: "TODAY",
      platform: "LinkedIn",
      action: "Published architectural case study carousel with 8 slides",
      author: "Alex Vance",
      status: "COMPLETED",
    },
    {
      id: 2,
      time: "08:15 AM",
      date: "TODAY",
      platform: "Instagram",
      action: "Scheduled visual reel broadcast for 18:00 UTC",
      author: "Automated Queue",
      status: "QUEUED",
    },
    {
      id: 3,
      time: "04:30 PM",
      date: "YESTERDAY",
      platform: "Analytics Engine",
      action: "Weekly cross-platform performance breakdown compiled",
      author: "System Bot",
      status: "SYNCED",
    },
    {
      id: 4,
      time: "11:20 AM",
      date: "YESTERDAY",
      platform: "X (Twitter)",
      action: "Automated 5-part thread broadcast completed",
      author: "Alex Vance",
      status: "COMPLETED",
    },
    {
      id: 5,
      time: "09:00 AM",
      date: "2 DAYS AGO",
      platform: "Facebook",
      action: "Updated cover banner & synchronized business account credentials",
      author: "Alex Vance",
      status: "UPDATED",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Editorial Header Section */}
      <div className="dash-hero-header hairline-b">
        <div className="dash-header-titles">
          <span className="eyebrow-text font-mono">AUTOMATE YOUR POST</span>
          <h1 className="dash-title font-serif">Social Media Dashboard</h1>
          <p className="dash-subtitle">
            Curating your digital voice through continuous editorial scheduling and high-fidelity metrics.
          </p>
        </div>
      </div>

      {/* Top Performing Post Banner */}
      <div className="top-post-banner hairline-b">
        <div className="showcase-img-frame">
          <img
            src="/biking-over-bridge.jpg"
            alt="Highest reach post image"
            className="showcase-img"
          />
        </div>
        <div className="top-post-right">
          <div className="top-post-left">
            <div className="top-post-kicker font-mono">
              <TrendingUp size={14} />
              <span>HIGHEST REACH POST</span>
            </div>
            <h2 className="top-post-title font-serif">"Urban Transitions &amp; Spatial Architecture Case Study"</h2>
            <p className="top-post-meta font-mono">
              LinkedIn · Jul 28, 2026 · <strong>42,800 impressions</strong> · 9.2% engagement
            </p>
            <p className="top-post-nudge">
              This post is your highest reach performer. Keep the momentum going — publish another update to extend audience reach and engagement.
            </p>
          </div>
          <button className="top-post-cta" onClick={() => navigate("/scheduler") }>
            <span>Schedule a Follow-up</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Open Metrics Strip */}
      <div className="metrics-strip hairline-b">
        {stats.map((item) => (
          <div key={item.title} className="metric-item">
            <div className="metric-top-row">
              <span className="metric-title font-mono">{item.title}</span>
              <span className="metric-icon-wrap">{item.icon}</span>
            </div>
            <div className="metric-value font-serif">{item.value}</div>
            <div className="metric-change font-mono">{item.change}</div>
          </div>
        ))}
      </div>

      {/* Full-Width Activity Timeline with Correctly Formatted Rows */}
      <div className="activity-section">
        <div className="section-title-row hairline-b">
          <div className="title-with-icon">
            <Activity size={20} />
            <h2 className="section-heading font-serif">Activity Timeline</h2>
          </div>
          <span className="section-count font-mono">5 RECENT EVENTS</span>
        </div>

        <div className="timeline-table-header hairline-b font-mono">
          <span className="col-time">TIMESTAMP</span>
          <span className="col-action-desc">ACTIVITY DESCRIPTION</span>
          <span className="col-actor">INITIATED BY</span>
          <span className="col-status-tag">STATUS</span>
        </div>

        <div className="activity-flat-list">
          {recentActivity.map((act) => (
            <div key={act.id} className="activity-full-row hairline-b">
              <div className="col-time font-mono">
                <span className="time-primary">{act.time}</span>
                <span className="time-sub">{act.date}</span>
              </div>

              <div className="col-action-desc">
                <span className="action-text">{act.action}</span>
              </div>

              <div className="col-actor font-mono">
                <span className="actor-name">{act.author}</span>
              </div>

              <div className="col-status-tag">
                <span className={`status-pill font-mono ${act.status.toLowerCase()}`}>
                  {act.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;