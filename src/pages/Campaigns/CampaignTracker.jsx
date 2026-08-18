import './CampaignTracker.css';

export default function CampaignTracker({ campaign, onBack }) {
  // Use passed props or default fallback data
  const name = campaign?.name || 'Summer Product Launch';
  const platform = campaign?.platform || 'Instagram';
  const status = campaign?.status || 'Active';
  const budget = campaign?.budget || '$5,000';
  const spent = campaign?.spent || '$2,450';
  const reach = campaign?.reach || '12.4K';
  const conversions = campaign?.conversions || '142';

  return (
    <div className="tracker-page">
      {/* Top Bar with Back Button */}
      <div className="tracker-top-bar">
        <button className="back-btn" onClick={onBack}>
          ← Back to Campaigns
        </button>
      </div>

      {/* Campaign Details Header */}
      <div className="tracker-header">
        <div>
          <span className="section-label">LIVE TRACKER</span>
          <h2>{name}</h2>
          <p>
            Platform: <strong>{platform}</strong> • Status:{' '}
            <span className={`status-pill ${status.toLowerCase()}`}>
              {status}
            </span>
          </p>
        </div>

        <button className="edit-btn">Edit Campaign</button>
      </div>

      {/* KPI Cards */}
      <div className="tracker-stats-grid">
        <div className="stat-card">
          <p className="stat-label">Budget Allocated</p>
          <span className="stat-value">{budget}</span>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Spent</p>
          <span className="stat-value">{spent}</span>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Reach</p>
          <span className="stat-value">{reach}</span>
        </div>
        <div className="stat-card">
          <p className="stat-label">Conversions</p>
          <span className="stat-value">{conversions}</span>
        </div>
      </div>

      {/* Tracking Table Section */}
      <div className="tracker-table-card">
        <h3>Daily Performance Logs</h3>
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>CTR</th>
              <th>Spend</th>
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