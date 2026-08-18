import "./CampaignTracker.css";

export default function CampaignTracker() {
  return (
    <div className="tracker-container">
      {/* Header */}
      <div className="tracker-header">
        <div>
          <button className="back-btn">&larr; Back to Campaigns</button>
          <div className="live-tracker-tag">LIVE TRACKER</div>
          <h1 className="campaign-title">Summer Product Launch</h1>
          <div className="status-row">
            Platform: <strong>Instagram</strong> &bull; Status: <span className="status-badge">Active</span>
          </div>
        </div>
        <button className="edit-btn">Edit Campaign</button>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">BUDGET ALLOCATED</div>
          <p className="metric-value">$5,000</p>
        </div>
        <div className="metric-card">
          <div className="metric-label">TOTAL SPENT</div>
          <p className="metric-value">$2,450</p>
        </div>
        <div className="metric-card">
          <div className="metric-label">TOTAL REACH</div>
          <p className="metric-value">12.4K</p>
        </div>
        <div className="metric-card">
          <div className="metric-label">CONVERSIONS</div>
          <p className="metric-value">142</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="logs-card">
        <h3>Daily Performance Logs</h3>
        <table className="logs-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>IMPRESSIONS</th>
              <th>CLICKS</th>
              <th>CTR</th>
              <th>SPEND</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10 Aug 2026</td>
              <td>2,400</td>
              <td>180</td>
              <td>7.5%</td>
              <td>$120</td>
            </tr>
            <tr>
              <td>09 Aug 2026</td>
              <td>3,100</td>
              <td>240</td>
              <td>7.7%</td>
              <td>$150</td>
            </tr>
            <tr>
              <td>08 Aug 2026</td>
              <td>1,800</td>
              <td>110</td>
              <td>6.1%</td>
              <td>$90</td>
            </tr>
            <tr>
              <td>07 Aug 2026</td>
              <td>5,100</td>
              <td>420</td>
              <td>8.2%</td>
              <td>$280</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}