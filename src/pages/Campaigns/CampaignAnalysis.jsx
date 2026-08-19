import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCampaign,
  getCampaigns,
  getCampaignTracking,
  getCampaignTrackingSummary,
  getCampaignPerformance,
  getCampaignROI,
  compareCampaignROI,
} from "../../services/campaignService";
import "./CampaignAnalysis.css";

export default function CampaignAnalysis() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tracking");
  const [campaign, setCampaign] = useState(null);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [roiData, setRoiData] = useState({
    revenue: "",
    conversions: "",
    costPerConversion: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("");
        const [campaignData, allCampaignsData, summaryData, trackingData, roiDataResponse] = await Promise.all([
          getCampaign(campaignId),
          getCampaigns(),
          getCampaignTrackingSummary(campaignId),
          getCampaignTracking(campaignId),
          getCampaignROI(campaignId),
        ]);

        setCampaign(campaignData.campaign);
        setAllCampaigns(allCampaignsData.campaigns || []);
        setSummary(summaryData.summary);
        setPerformance(trackingData.performance || []);
        
        // Pre-populate ROI data from backend
        if (roiDataResponse && roiDataResponse.roi) {
          setRoiData({
            revenue: roiDataResponse.roi.revenue || "",
            conversions: roiDataResponse.roi.conversions || "",
            costPerConversion: roiDataResponse.roi.cost_per_conversion || "",
          });
        }
        
        // Pre-select current campaign for comparison
        setSelectedCampaigns([campaignId]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [campaignId]);

  const calculateROI = () => {
    if (!campaign || !roiData.revenue) return 0;
    
    const budget = campaign.budget || 0;
    const revenue = parseFloat(roiData.revenue) || 0;
    const roi = ((revenue - budget) / budget) * 100;
    return roi.toFixed(2);
  };

  const calculateROIPerConversion = () => {
    if (!roiData.conversions || !roiData.revenue) return 0;
    
    const conversions = parseFloat(roiData.conversions) || 0;
    const revenue = parseFloat(roiData.revenue) || 0;
    return conversions > 0 ? (revenue / conversions).toFixed(2) : 0;
  };

  const handleCampaignSelection = (campaignId) => {
    setSelectedCampaigns(prev => {
      if (prev.includes(campaignId)) {
        return prev.filter(id => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  if (loading) {
    return <div className="analysis-page">Loading campaign analysis...</div>;
  }

  if (error) {
    return (
      <div className="analysis-page">
        <p style={{ color: "#dc2626" }}>{error}</p>
        <button className="back-btn" onClick={() => navigate("/campaigns")}>
          Back to Campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <div className="analysis-top-bar">
        <button className="back-btn" onClick={() => navigate("/campaigns")}>
          ← Back to Campaigns
        </button>
      </div>

      <div className="analysis-header">
        <div>
          <span className="section-label">CAMPAIGN ANALYSIS</span>
          <h2>{campaign?.campaign_name}</h2>
          <p>
            Platform: <strong>{campaign?.platform}</strong> • Status:{" "}
            <span className={`status-pill ${campaign?.status?.toLowerCase()}`}>
              {campaign?.status}
            </span>
          </p>
        </div>
      </div>

      <div className="analysis-tabs">
        <button
          className={`tab-btn ${activeTab === "tracking" ? "active" : ""}`}
          onClick={() => setActiveTab("tracking")}
        >
          Tracking Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === "compare" ? "active" : ""}`}
          onClick={() => setActiveTab("compare")}
        >
          Compare Campaigns
        </button>
        <button
          className={`tab-btn ${activeTab === "separate" ? "active" : ""}`}
          onClick={() => setActiveTab("separate")}
        >
          Separate Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === "roi" ? "active" : ""}`}
          onClick={() => setActiveTab("roi")}
        >
          ROI Calculator
        </button>
      </div>

      <div className="analysis-content">
        {activeTab === "tracking" && (
          <div className="tab-content tracking-tab">
            <h3>Tracking Analysis</h3>
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
              <div className="stat-card">
                <p className="stat-label">Click-Through Rate</p>
                <span className="stat-value">
                  {summary?.clicks && summary?.impressions 
                    ? ((summary.clicks / summary.impressions) * 100).toFixed(2) 
                    : 0}%
                </span>
              </div>
              <div className="stat-card">
                <p className="stat-label">Engagement Rate</p>
                <span className="stat-value">
                  {performance.length > 0 
                    ? (performance.reduce((acc, p) => acc + (p.engagement_rate || 0), 0) / performance.length).toFixed(2) 
                    : 0}%
                </span>
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
        )}

        {activeTab === "compare" && (
          <div className="tab-content compare-tab">
            <h3>Compare Campaigns</h3>
            <p className="tab-description">Select campaigns to compare their performance metrics</p>
            
            <div className="campaign-selection">
              <h4>Select Campaigns to Compare</h4>
              <div className="campaign-checkbox-list">
                {allCampaigns.map((cmp) => (
                  <label key={cmp.campaign_id} className="campaign-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(cmp.campaign_id)}
                      onChange={() => handleCampaignSelection(cmp.campaign_id)}
                    />
                    <span>{cmp.campaign_name}</span>
                    <span className="campaign-platform">{cmp.platform}</span>
                  </label>
                ))}
              </div>
            </div>

            {selectedCampaigns.length > 0 && (
              <div className="comparison-table-card">
                <h4>Performance Comparison</h4>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Platform</th>
                      <th>Budget</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCampaigns
                      .filter(cmp => selectedCampaigns.includes(cmp.campaign_id))
                      .map((cmp) => (
                        <tr key={cmp.campaign_id}>
                          <td>{cmp.campaign_name}</td>
                          <td>{cmp.platform}</td>
                          <td>${cmp.budget || 0}</td>
                          <td>
                            <span className={`status-pill ${cmp.status?.toLowerCase()}`}>
                              {cmp.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="action-btn"
                              onClick={() => navigate(`/campaigns/analysis/${cmp.campaign_id}`)}
                            >
                              View Analysis
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "separate" && (
          <div className="tab-content separate-tab">
            <h3>Separate Analysis</h3>
            <p className="tab-description">Deep dive into this campaign's individual performance</p>
            
            <div className="separate-analysis-grid">
              <div className="analysis-card">
                <h4>Campaign Overview</h4>
                <div className="analysis-details">
                  <div className="detail-row">
                    <span className="detail-label">Campaign Name:</span>
                    <span className="detail-value">{campaign?.campaign_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Platform:</span>
                    <span className="detail-value">{campaign?.platform}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Objective:</span>
                    <span className="detail-value">{campaign?.objective || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value status-pill ${campaign?.status?.toLowerCase()}`}>
                      {campaign?.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">
                      {campaign?.start_date} to {campaign?.end_date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="analysis-card">
                <h4>Performance Metrics</h4>
                <div className="metrics-chart">
                  <div className="metric-bar">
                    <span className="metric-label">Reach</span>
                    <div className="metric-bar-bg">
                      <div 
                        className="metric-bar-fill" 
                        style={{ width: `${Math.min((summary?.reach || 0) / 10000 * 100, 100)}%` }}
                      >
                        {summary?.reach || 0}
                      </div>
                    </div>
                  </div>
                  <div className="metric-bar">
                    <span className="metric-label">Impressions</span>
                    <div className="metric-bar-bg">
                      <div 
                        className="metric-bar-fill" 
                        style={{ width: `${Math.min((summary?.impressions || 0) / 10000 * 100, 100)}%` }}
                      >
                        {summary?.impressions || 0}
                      </div>
                    </div>
                  </div>
                  <div className="metric-bar">
                    <span className="metric-label">Conversions</span>
                    <div className="metric-bar-bg">
                      <div 
                        className="metric-bar-fill" 
                        style={{ width: `${Math.min((summary?.conversions || 0) / 1000 * 100, 100)}%` }}
                      >
                        {summary?.conversions || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analysis-card">
                <h4>Performance Timeline</h4>
                <div className="timeline-chart">
                  {performance.length > 0 ? (
                    performance.map((item) => (
                      <div key={item.performance_id} className="timeline-item">
                        <span className="timeline-date">{item.record_date}</span>
                        <div className="timeline-metrics">
                          <span className="timeline-metric">
                            Impressions: {item.impressions || 0}
                          </span>
                          <span className="timeline-metric">
                            Clicks: {item.clicks || 0}
                          </span>
                          <span className="timeline-metric">
                            Conversions: {item.conversions || 0}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No performance data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "roi" && (
          <div className="tab-content roi-tab">
            <h3>ROI Calculator</h3>
            <p className="tab-description">Calculate Return on Investment for this campaign</p>
            
            <div className="roi-calculator">
              <div className="roi-input-card">
                <h4>Campaign Investment</h4>
                <div className="roi-display">
                  <span className="roi-label">Total Budget:</span>
                  <span className="roi-value">${campaign?.budget || 0}</span>
                </div>
              </div>

              <div className="roi-input-card">
                <h4>Revenue & Conversions</h4>
                <div className="roi-form">
                  <div className="form-group">
                    <label>Total Revenue Generated ($)</label>
                    <input
                      type="number"
                      value={roiData.revenue}
                      onChange={(e) => setRoiData({ ...roiData, revenue: e.target.value })}
                      placeholder="Enter total revenue"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Conversions</label>
                    <input
                      type="number"
                      value={roiData.conversions}
                      onChange={(e) => setRoiData({ ...roiData, conversions: e.target.value })}
                      placeholder="Enter total conversions"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cost Per Conversion ($)</label>
                    <input
                      type="number"
                      value={roiData.costPerConversion}
                      onChange={(e) => setRoiData({ ...roiData, costPerConversion: e.target.value })}
                      placeholder="Auto-calculated or enter manually"
                    />
                  </div>
                </div>
              </div>

              <div className="roi-results-card">
                <h4>ROI Results</h4>
                <div className="roi-metrics">
                  <div className="roi-metric">
                    <span className="roi-metric-label">Return on Investment:</span>
                    <span className={`roi-metric-value ${calculateROI() >= 0 ? 'positive' : 'negative'}`}>
                      {calculateROI()}%
                    </span>
                  </div>
                  <div className="roi-metric">
                    <span className="roi-metric-label">Net Profit/Loss:</span>
                    <span className={`roi-metric-value ${(parseFloat(roiData.revenue) - (campaign?.budget || 0)) >= 0 ? 'positive' : 'negative'}`}>
                      ${(parseFloat(roiData.revenue) - (campaign?.budget || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="roi-metric">
                    <span className="roi-metric-label">Revenue Per Conversion:</span>
                    <span className="roi-metric-value">
                      ${calculateROIPerConversion()}
                    </span>
                  </div>
                  <div className="roi-metric">
                    <span className="roi-metric-label">Total Cost Per Conversion:</span>
                    <span className="roi-metric-value">
                      ${roiData.costPerConversion || ((campaign?.budget || 0) / (parseFloat(roiData.conversions) || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}