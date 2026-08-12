import { useState } from 'react';
import CampaignTracker from './CampaignTracker';
import './Campaigns.css';

const campaignsListData = [
  {
    id: 'summer-launch',
    name: 'Summer Product Launch',
    platform: 'Instagram',
    reach: '12.4K',
    status: 'Active',
    budget: '$5,000',
    spent: '$2,450',
    conversions: '142',
  },
  {
    id: 'brand-awareness',
    name: 'Brand Awareness Q3',
    platform: 'Facebook',
    reach: '8.1K',
    status: 'Active',
    budget: '$3,500',
    spent: '$890',
    conversions: '58',
  },
  {
    id: 'holiday-promo',
    name: 'Holiday Promotion',
    platform: 'Twitter',
    reach: '25.0K',
    status: 'Scheduled',
    budget: '$6,000',
    spent: '$0',
    conversions: '0',
  },
];

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // If a campaign is selected, render the CampaignTracker page for it
  if (selectedCampaign) {
    return (
      <CampaignTracker
        campaign={selectedCampaign}
        onBack={() => setSelectedCampaign(null)}
      />
    );
  }

  return (
    <div className="campaigns-page">
      <div className="campaigns-header">
        <div>
          <span className="section-label">CAMPAIGNS OVERVIEW</span>
          <h2>Campaigns</h2>
          <p>Select a campaign below to open its detailed tracking analytics.</p>
        </div>
        <button className="create-btn">+ New Campaign</button>
      </div>

      <div className="campaigns-search-bar">
        <input type="text" placeholder="Search campaigns..." />
      </div>

      <div className="campaigns-list">
        {campaignsListData.map((item) => (
          <div
            key={item.id}
            className="campaign-card"
            onClick={() => setSelectedCampaign(item)}
          >
            <div className="card-info">
              <h3>{item.name}</h3>
              <p>
                Platform: <span>{item.platform}</span> • Reach: <span>{item.reach}</span>
              </p>
            </div>
            <div className="card-badge">
              <span className={`status-pill ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
              <span className="arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}