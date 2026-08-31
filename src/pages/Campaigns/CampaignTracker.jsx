import './CampaignTracker.css';

export default function CampaignTracker({ campaign, onBack }) {
  const name = campaign?.name || 'Summer Product Launch';
  const platform = campaign?.platform || 'Instagram';
  const status = campaign?.status || 'Active';
  const budget = campaign?.budget || '$5,000';
  const spent = campaign?.spent || '$2,450';
  const reach = campaign?.reach || '12.4K';
  const conversions = campaign?.conversions || '142';

  const logs = campaign?.logs || [
    { date: '10 Aug 2026', impressions: '2,400', clicks: '180', ctr: '7.5%', spend: '$120' },
    { date: '09 Aug 2026', impressions: '3,100', clicks: '240', ctr: '7.7%', spend: '$150' },
    { date: '08 Aug 2026', impressions: '1,800', clicks: '110', ctr: '6.1%', spend: '$90' },
    { date: '07 Aug 2026', impressions: '5,100', clicks: '420', ctr: '8.2%', spend: '$280' },
  ];

  return (
    <div className="tracker-wrapper">
      <div className="tracker-card">
        {/* Top Controls Row */}
        <div className="tracker-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Campaigns
          </button>
          <button className="edit-btn">Edit Campaign</button>
        </div>

        {/* Campaign Info */}
        <div className="campaign-meta">
          <span className="live-tracker-label">LIVE TRACKER</span>
          <h1 className="campaign-title">{name}</h1>
          <p className="platform-status">
            Platform: <strong>{platform}</strong> • Status:{' '}
            <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
          </p>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">BUDGET ALLOCATED</span>
            <h2 className="metric-value">{budget}</h2>
          </div>
          <div className="metric-card">
            <span className="metric-label">TOTAL SPENT</span>
            <h2 className="metric-value">{spent}</h2>
          </div>
          <div className="metric-card">
            <span className="metric-label">TOTAL REACH</span>
            <h2 className="metric-value">{reach}</h2>
          </div>
          <div className="metric-card">
            <span className="metric-label">CONVERSIONS</span>
            <h2 className="metric-value">{conversions}</h2>
          </div>
        </div>

        {/* Bottom Table Card */}
        <div className="logs-card">
          <h3 className="logs-title">Daily Performance Logs</h3>
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
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.date}</td>
                  <td>{log.impressions}</td>
                  <td>{log.clicks}</td>
                  <td>{log.ctr}</td>
                  <td>{log.spend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}