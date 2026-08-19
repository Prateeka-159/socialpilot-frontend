import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCampaigns,
  createCampaign,
  deleteCampaign,
} from "../../services/campaignService";
import "./Campaigns.css";

export default function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    campaign_name: "",
    objective: "",
    budget: "",
    platform: "Instagram",
    start_date: "",
    end_date: "",
  });

  const loadCampaigns = async () => {
    try {
      setError("");
      const data = await getCampaigns();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.campaign_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await createCampaign({
        ...formData,
        budget: formData.budget ? Number(formData.budget) : null,
      });

      setShowForm(false);
      setFormData({
        campaign_name: "",
        objective: "",
        budget: "",
        platform: "Instagram",
        start_date: "",
        end_date: "",
      });
      await loadCampaigns();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (campaignId) => {
    const confirmed = window.confirm("Delete this campaign?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteCampaign(campaignId);
      await loadCampaigns();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="campaigns-page">
      <div className="campaigns-header">
        <div>
          <span className="section-label">CAMPAIGN MANAGEMENT</span>
          <h2>Campaigns</h2>
          <p>Create, monitor, and optimize your social media campaigns.</p>
        </div>
        <button className="create-btn" onClick={() => setShowForm(true)}>
          + Create Campaign
        </button>
      </div>

      <div className="campaigns-search-bar">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <p>Loading campaigns...</p>}
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      <div className="campaigns-list">
        {filteredCampaigns.length === 0 && !loading ? (
          <p>No campaigns found.</p>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div
              key={campaign.campaign_id}
              className="campaign-card"
              onClick={() => navigate(`/campaigns/analysis/${campaign.campaign_id}`)}
            >
              <div className="card-info">
                <h3>{campaign.campaign_name}</h3>
                <p>
                  {campaign.platform} • {campaign.status}
                </p>
                <span>
                  {campaign.start_date} to {campaign.end_date}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="create-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/campaigns/track/${campaign.campaign_id}`);
                  }}
                >
                  Track
                </button>
                <button
                  className="create-btn"
                  style={{ backgroundColor: "#6366f1" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/campaigns/analysis/${campaign.campaign_id}`);
                  }}
                >
                  Analyze
                </button>
                <button
                  className="create-btn"
                  style={{ backgroundColor: "#6b7280" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(campaign.campaign_id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "grid", placeItems: "center" }}>
          <form
            onSubmit={handleCreate}
            style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "420px", display: "grid", gap: "12px" }}
          >
            <h3>Create Campaign</h3>
            <input
              required
              placeholder="Campaign name"
              value={formData.campaign_name}
              onChange={(event) =>
                setFormData({ ...formData, campaign_name: event.target.value })
              }
            />
            <input
              placeholder="Objective"
              value={formData.objective}
              onChange={(event) =>
                setFormData({ ...formData, objective: event.target.value })
              }
            />
            <input
              type="number"
              placeholder="Budget"
              value={formData.budget}
              onChange={(event) =>
                setFormData({ ...formData, budget: event.target.value })
              }
            />
            <select
              value={formData.platform}
              onChange={(event) =>
                setFormData({ ...formData, platform: event.target.value })
              }
            >
              <option>Instagram</option>
              <option>Facebook</option>
              <option>LinkedIn</option>
              <option>X(Twitter)</option>
              <option>YouTube</option>
              <option>Pinterest</option>
            </select>
            <input
              required
              type="date"
              value={formData.start_date}
              onChange={(event) =>
                setFormData({ ...formData, start_date: event.target.value })
              }
            />
            <input
              required
              type="date"
              value={formData.end_date}
              onChange={(event) =>
                setFormData({ ...formData, end_date: event.target.value })
              }
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="create-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
