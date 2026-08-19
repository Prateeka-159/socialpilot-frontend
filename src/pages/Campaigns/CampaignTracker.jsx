import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCampaign,
  getCampaignTracking,
  getCampaignTrackingSummary,
} from "../../services/campaignService";
import "./CampaignTracker.css";

export default function CampaignTracker() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTracking = async () => {
      try {
        setError("");
        const [campaignData, summaryData, trackingData] = await Promise.all([
          getCampaign(campaignId),
          getCampaignTrackingSummary(campaignId),
          getCampaignTracking(campaignId),
        ]);

        setCampaign(campaignData.campaign);
        setSummary(summaryData.summary);
        setPerformance(trackingData.performance || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTracking();
  }, [campaignId]);

  if (loading) {
    return <div className="tracker-page">Loading campaign tracker...</div>;
  }

  if (error) {
    return (
      <div className="tracker-page">
        <p style={{ color: "#dc2626" }}>{error}</p>
        <button className="back-btn" onClick={() => navigate("/campaigns")}>
          Back to Campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="tracker-page">
      <div className="tracker-top-bar">
        <button className="back-btn" onClick={() => navigate("/campaigns")}>
          ← Back to Campaigns
        </button>
      </div>

      <div className="tracker-header">
        <div>
          <span className="section-label">LIVE TRACKER</span>
          <h2>{campaign?.campaign_name}</h2>
          <p>
            Platform: <strong>{campaign?.platform}</strong> • Status:{" "}
            <span className={`status-pill ${campaign?.status?.toLowerCase()}`}>
              {campaign?.status}
            </span>
          </p>
        </div>
      </div>

      <div className="tracker-stats-grid">
        <div className="stat-card">
          <p className="stat-label">Budget Allocated</p>
          <span className="stat-value">${campaign?.budget || 0}</span>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Reach</p>
          <span className="stat-value">{summary?.reach || 0}</span>
        </div>
        <div className="stat-card">
          <p className="stat-label">Impressions</p>
          <span className="stat-value">{summary?.impressions || 0}</span>
        </div>
        <div className="stat-card">
          <p className="stat-label">Conversions</p>
          <span className="stat-value">{summary?.conversions || 0}</span>
        </div>
      </div>

      <div className="tracker-table-card">
        <h3>Daily Performance Logs</h3>
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>Engagement Rate</th>
              <th>Conversions</th>
            </tr>
          </thead>
          <tbody>
            {performance.length === 0 ? (
              <tr>
                <td colSpan="5">No performance records yet.</td>
              </tr>
            ) : (
              performance.map((item) => (
                <tr key={item.performance_id}>
                  <td>{item.record_date}</td>
                  <td>{item.impressions || 0}</td>
                  <td>{item.clicks || 0}</td>
                  <td>{item.engagement_rate || 0}%</td>
                  <td>{item.conversions || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
