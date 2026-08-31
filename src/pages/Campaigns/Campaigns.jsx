import { useState } from 'react';
import CampaignTracker from './CampaignTracker';
import './Campaigns.css';

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    platform: 'Instagram',
    status: 'Active',
    budget: '$1,000'
  });

  const [campaignList, setCampaignList] = useState([
    {
      id: 1,
      name: 'Summer Product Launch',
      platform: 'Instagram',
      status: 'Active',
      budget: '$5,000',
      spent: '$2,450',
      reach: '12.4K',
      conversions: '142',
      logs: [
        { date: '10 Aug 2026', impressions: '2,400', clicks: '180', ctr: '7.5%', spend: '$120' },
        { date: '09 Aug 2026', impressions: '3,100', clicks: '240', ctr: '7.7%', spend: '$150' },
        { date: '08 Aug 2026', impressions: '1,800', clicks: '110', ctr: '6.1%', spend: '$90' },
        { date: '07 Aug 2026', impressions: '5,100', clicks: '420', ctr: '8.2%', spend: '$280' },
      ]
    },
    {
      id: 2,
      name: 'Fall Fashion Brand Awareness',
      platform: 'Facebook',
      status: 'Active',
      budget: '$8,500',
      spent: '$4,120',
      reach: '28.9K',
      conversions: '310',
      logs: [
        { date: '10 Aug 2026', impressions: '4,500', clicks: '320', ctr: '7.1%', spend: '$210' },
        { date: '09 Aug 2026', impressions: '5,200', clicks: '410', ctr: '7.8%', spend: '$260' },
        { date: '08 Aug 2026', impressions: '3,900', clicks: '290', ctr: '7.4%', spend: '$180' },
        { date: '07 Aug 2026', impressions: '6,100', clicks: '500', ctr: '8.1%', spend: '$320' },
      ]
    },
    {
      id: 3,
      name: 'Q3 Tech Gadget Promo',
      platform: 'LinkedIn',
      status: 'Paused',
      budget: '$3,200',
      spent: '$1,800',
      reach: '8.1K',
      conversions: '88',
      logs: [
        { date: '10 Aug 2026', impressions: '1,200', clicks: '85', ctr: '7.0%', spend: '$75' },
        { date: '09 Aug 2026', impressions: '1,500', clicks: '95', ctr: '6.3%', spend: '$90' },
        { date: '08 Aug 2026', impressions: '1,100', clicks: '60', ctr: '5.4%', spend: '$50' },
        { date: '07 Aug 2026', impressions: '2,300', clicks: '140', ctr: '6.0%', spend: '$110' },
      ]
    }
  ]);

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) return;

    const createdItem = {
      id: Date.now(),
      name: newCampaign.name,
      platform: newCampaign.platform,
      status: newCampaign.status,
      budget: newCampaign.budget,
      spent: '$0',
      reach: '0',
      conversions: '0',
      logs: []
    };

    setCampaignList([createdItem, ...campaignList]);
    setNewCampaign({ name: '', platform: 'Instagram', status: 'Active', budget: '$1,000' });
    setShowModal(false);
  };

  const handleDeleteCampaign = (e, id) => {
    e.stopPropagation();
    setCampaignList(campaignList.filter(item => item.id !== id));
  };

  if (selectedCampaign) {
    return (
      <CampaignTracker 
        campaign={selectedCampaign} 
        onBack={() => setSelectedCampaign(null)} 
      />
    );
  }

  return (
    <div className="campaigns-wrapper">
      <div className="campaigns-card">
        <div className="campaigns-header">
          <h2>All Campaigns</h2>
          <button className="create-btn" onClick={() => setShowModal(true)}>
            + Create Campaign
          </button>
        </div>

        <div className="campaigns-grid">
          {campaignList.map((campaign) => (
            <div 
              key={campaign.id} 
              className="campaign-card" 
              onClick={() => setSelectedCampaign(campaign)}
            >
              <h3>{campaign.name}</h3>
              <div className="card-right-group">
                <span className="campaign-details">
                  Platform: {campaign.platform} • Status: {campaign.status}
                </span>
                <button 
                  className="delete-btn" 
                  onClick={(e) => handleDeleteCampaign(e, campaign.id)}
                  title="Remove Campaign"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Create New Campaign</h3>
            <form onSubmit={handleCreateCampaign}>
              <div className="form-group">
                <label>Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Winter Holiday Sale"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Platform</label>
                <select 
                  value={newCampaign.platform}
                  onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Google Ads">Google Ads</option>
                </select>
              </div>

              <div className="form-group">
                <label>Budget</label>
                <input 
                  type="text" 
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}