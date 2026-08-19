import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getCampaigns,
  getCampaignPerformance,
} from "../../services/campaignService";
import {
  getPostAnalytics,
  getPostEngagement,
  getAudienceGrowth,
  getOverallAnalytics,
  getUserPerformanceMetrics,
  getCrossPlatformAnalytics,
  getCampaignEngagement,
} from "../../services/analyticsService";
import { getSocialAccounts } from "../../services/socialService";
import "./OverallAnalysis.css";

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"];

export default function OverallAnalysis() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("7d");
  const [metric, setMetric] = useState("impressions");
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  
  // Data states
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsData, setCampaignsData] = useState([]);
  const [overallMetrics, setOverallMetrics] = useState({
    totalImpressions: 0,
    totalEngagements: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalReach: 0,
    averageEngagementRate: 0,
    totalBudget: 0,
    totalRevenue: 0,
    averageROI: 0,
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [platformDistribution, setPlatformDistribution] = useState([]);
  const [topPerformingCampaigns, setTopPerformingCampaigns] = useState([]);
  const [audienceGrowth, setAudienceGrowth] = useState([]);

  useEffect(() => {
    loadOverallAnalysis();
  }, [timeRange, metric]);

  const loadOverallAnalysis = async () => {
    try {
      setError("");
      setLoading(true);

      // Use the new backend overall analytics endpoint
      const overallData = await getOverallAnalytics(timeRange);
      
      // Fetch all user campaigns
      const campaignsResponse = await getCampaigns();
      const userCampaigns = campaignsResponse.campaigns || [];
      setCampaigns(userCampaigns);
      setSelectedCampaigns(userCampaigns.map(c => c.campaign_id));

      // Fetch detailed data for each campaign
      const campaignsDetailedData = await Promise.all(
        userCampaigns.map(async (campaign) => {
          try {
            const [engagementData, performanceData] = await Promise.all([
              getCampaignEngagement(campaign.campaign_id),
              getCampaignPerformance(campaign.campaign_id),
            ]);

            return {
              ...campaign,
              engagement: engagementData.engagement || {},
              performance: performanceData.performance || [],
            };
          } catch (err) {
            console.error(`Error fetching data for campaign ${campaign.campaign_id}:`, err);
            return {
              ...campaign,
              engagement: {},
              performance: [],
            };
          }
        })
      );

      setCampaignsData(campaignsDetailedData);

      // Use backend calculated metrics if available, otherwise calculate locally
      if (overallData && overallData.overall_metrics) {
        const totalBudget = overallData.overall_metrics.total_budget || 0;
        const totalConversions = overallData.overall_metrics.total_conversions || 0;
        const totalRevenue = totalConversions * 50; // Assuming $50 per conversion
        const averageROI = totalBudget > 0 
          ? ((totalRevenue - totalBudget) / totalBudget * 100).toFixed(2) 
          : 0;

        setOverallMetrics({
          totalImpressions: overallData.overall_metrics.total_impressions || 0,
          totalEngagements: overallData.overall_metrics.total_engagements || 0,
          totalClicks: overallData.overall_metrics.total_clicks || 0,
          totalConversions: totalConversions,
          totalReach: overallData.overall_metrics.total_reach || 0,
          averageEngagementRate: overallData.overall_metrics.average_engagement_rate || 0,
          totalBudget: totalBudget,
          totalRevenue: totalRevenue,
          averageROI: averageROI,
        });
      } else {
        // Fallback to local calculation
        calculateOverallMetrics(campaignsDetailedData);
      }

      // Process performance data for charts
      processPerformanceData(campaignsDetailedData);

      // Calculate platform distribution
      calculatePlatformDistribution(userCampaigns);

      // Identify top performing campaigns
      identifyTopCampaigns(campaignsDetailedData);

      // Fetch audience growth if social accounts exist
      try {
        const socialAccounts = await getSocialAccounts();
        if (socialAccounts.length > 0) {
          const growthData = await getAudienceGrowth(socialAccounts[0].social_account_id);
          setAudienceGrowth(growthData.audience_growth || []);
        }
      } catch (err) {
        console.error("Error fetching audience growth:", err);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallMetrics = (campaignsData) => {
    const metrics = {
      totalImpressions: 0,
      totalEngagements: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalReach: 0,
      averageEngagementRate: 0,
      totalBudget: 0,
      totalRevenue: 0,
      averageROI: 0,
    };

    let totalEngagementRate = 0;
    let campaignsWithRate = 0;

    campaignsData.forEach((campaign) => {
      const engagement = campaign.engagement || {};
      
      metrics.totalImpressions += engagement.impressions || 0;
      metrics.totalEngagements += engagement.total_engagements || 0;
      metrics.totalClicks += engagement.clicks || 0;
      metrics.totalReach += engagement.reach || 0;
      metrics.totalConversions += engagement.conversions || 0;
      metrics.totalBudget += campaign.budget || 0;

      if (engagement.average_engagement_rate) {
        totalEngagementRate += engagement.average_engagement_rate;
        campaignsWithRate++;
      }
    });

    metrics.averageEngagementRate = campaignsWithRate > 0 
      ? (totalEngagementRate / campaignsWithRate).toFixed(2) 
      : 0;

    // Calculate ROI (simplified - in real scenario would come from ROI endpoint)
    metrics.totalRevenue = metrics.totalConversions * 50; // Assuming $50 per conversion
    metrics.averageROI = metrics.totalBudget > 0 
      ? ((metrics.totalRevenue - metrics.totalBudget) / metrics.totalBudget * 100).toFixed(2) 
      : 0;

    setOverallMetrics(metrics);
  };

  const processPerformanceData = (campaignsData) => {
    // Aggregate performance data by date across all campaigns
    const dateMap = new Map();

    campaignsData.forEach((campaign) => {
      const performance = campaign.performance || [];
      
      performance.forEach((record) => {
        const date = record.record_date;
        if (!dateMap.has(date)) {
          dateMap.set(date, {
            date,
            impressions: 0,
            engagement: 0,
            clicks: 0,
            conversions: 0,
          });
        }

        const dayData = dateMap.get(date);
        dayData.impressions += record.impressions || 0;
        dayData.engagement += (record.likes || 0) + (record.comments || 0) + (record.shares || 0);
        dayData.clicks += record.clicks || 0;
        dayData.conversions += record.conversions || 0;
      });
    });

    // Convert to array and sort by date
    const sortedData = Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7) // Last 7 days
      .map(item => ({
        day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        ...item
      }));

    setPerformanceData(sortedData);
  };

  const calculatePlatformDistribution = (campaigns) => {
    const platformMap = new Map();

    campaigns.forEach((campaign) => {
      const platform = campaign.platform;
      platformMap.set(platform, (platformMap.get(platform) || 0) + 1);
    });

    const distribution = Array.from(platformMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    setPlatformDistribution(distribution);
  };

  const identifyTopCampaigns = (campaignsData) => {
    const sorted = [...campaignsData].sort((a, b) => {
      const engagementA = a.engagement?.total_engagements || 0;
      const engagementB = b.engagement?.total_engagements || 0;
      return engagementB - engagementA;
    });

    setTopPerformingCampaigns(sorted.slice(0, 5));
  };

  const getMetricTitle = () => {
    switch (metric) {
      case "engagement":
        return "Engagement";
      case "clicks":
        return "Link Clicks";
      case "conversions":
        return "Conversions";
      case "impressions":
      default:
        return "Impressions";
    }
  };

  const handleCampaignToggle = (campaignId) => {
    setSelectedCampaigns(prev => {
      if (prev.includes(campaignId)) {
        return prev.filter(id => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  if (loading) {
    return (
      <div className="overall-analysis-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overall-analysis-page">
        <div className="error-container">
          <p style={{ color: "#dc2626" }}>{error}</p>
          <button className="retry-btn" onClick={loadOverallAnalysis}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overall-analysis-page">
      {/* Header */}
      <div className="analysis-header">
        <div>
          <span className="section-label">OVERALL ANALYTICS</span>
          <h2>Your Performance Dashboard</h2>
          <p>Comprehensive analysis across all your campaigns and platforms</p>
        </div>
        <div className="header-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="metric-select"
          >
            <option value="impressions">Impressions</option>
            <option value="engagement">Engagement</option>
            <option value="clicks">Clicks</option>
            <option value="conversions">Conversions</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon impressions-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Impressions</p>
            <h3 className="kpi-value">{overallMetrics.totalImpressions.toLocaleString()}</h3>
            <p className="kpi-change positive">+12.5%</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon engagement-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Engagements</p>
            <h3 className="kpi-value">{overallMetrics.totalEngagements.toLocaleString()}</h3>
            <p className="kpi-change positive">+8.2%</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon clicks-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Clicks</p>
            <h3 className="kpi-value">{overallMetrics.totalClicks.toLocaleString()}</h3>
            <p className="kpi-change positive">+15.1%</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon conversions-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Conversions</p>
            <h3 className="kpi-value">{overallMetrics.totalConversions.toLocaleString()}</h3>
            <p className="kpi-change positive">+5.4%</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon roi-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Average ROI</p>
            <h3 className="kpi-value">{overallMetrics.averageROI}%</h3>
            <p className={`kpi-change ${parseFloat(overallMetrics.averageROI) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(overallMetrics.averageROI) >= 0 ? '+' : ''}{overallMetrics.averageROI}%
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon budget-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Budget</p>
            <h3 className="kpi-value">${overallMetrics.totalBudget.toLocaleString()}</h3>
            <p className="kpi-change neutral">Active</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card main-chart">
          <div className="chart-header">
            <h3>Daily {getMetricTitle()} Trend</h3>
            <p className="chart-subtitle">Performance over selected time period</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e2e8f0', 
                    color: '#1e293b', 
                    fontSize: '12px', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey={metric} 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ fill: '#6366f1', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card secondary-chart">
          <div className="chart-header">
            <h3>Platform Distribution</h3>
            <p className="chart-subtitle">Campaigns by platform</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e2e8f0', 
                    color: '#1e293b', 
                    fontSize: '12px', 
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            {platformDistribution.map((item, index) => (
              <div key={item.name} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Campaigns Section */}
      <div className="top-campaigns-section">
        <div className="section-header">
          <h3>Top Performing Campaigns</h3>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/campaigns')}
          >
            View All Campaigns
          </button>
        </div>
        <div className="campaigns-grid">
          {topPerformingCampaigns.map((campaign) => (
            <div 
              key={campaign.campaign_id} 
              className="campaign-summary-card"
              onClick={() => navigate(`/campaigns/analysis/${campaign.campaign_id}`)}
            >
              <div className="campaign-summary-header">
                <h4>{campaign.campaign_name}</h4>
                <span className={`campaign-status ${campaign.status?.toLowerCase()}`}>
                  {campaign.status}
                </span>
              </div>
              <div className="campaign-summary-metrics">
                <div className="metric-item">
                  <span className="metric-label">Engagements</span>
                  <span className="metric-value">
                    {(campaign.engagement?.total_engagements || 0).toLocaleString()}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Impressions</span>
                  <span className="metric-value">
                    {(campaign.engagement?.impressions || 0).toLocaleString()}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Engagement Rate</span>
                  <span className="metric-value">
                    {campaign.engagement?.average_engagement_rate || 0}%
                  </span>
                </div>
              </div>
              <div className="campaign-summary-footer">
                <span className="platform-tag">{campaign.platform}</span>
                <span className="budget-tag">${campaign.budget?.toLocaleString() || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Filter Section */}
      <div className="campaign-filter-section">
        <h3>Filter by Campaign</h3>
        <div className="campaign-filter-list">
          {campaigns.map((campaign) => (
            <label key={campaign.campaign_id} className="campaign-filter-item">
              <input
                type="checkbox"
                checked={selectedCampaigns.includes(campaign.campaign_id)}
                onChange={() => handleCampaignToggle(campaign.campaign_id)}
              />
              <span className="campaign-filter-name">{campaign.campaign_name}</span>
              <span className="campaign-filter-platform">{campaign.platform}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}