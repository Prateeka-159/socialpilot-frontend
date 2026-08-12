import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, PieChart as PieIcon, Layers } from "lucide-react";
import "./Analytics.css";
import { useAuth } from "../../context/AuthContext";

// Initial list of published posts with metrics
const initialPosts = [
  {
    id: 1,
    title: "Urban Transitions & Spatial Architecture Case Study",
    platform: "LinkedIn",
    date: "Jul 28, 2026",
    impressions: "42,800",
    likes: "1,420",
    engagement: 9.2,
    status: "PUBLISHED",
    followersImpact: 1420,
    monthIndex: 5, // Jun/Jul
  },
  {
    id: 2,
    title: "Monochrome Sand Ripples Reel & Motion Design",
    platform: "Instagram",
    date: "Jul 25, 2026",
    impressions: "38,500",
    likes: "3,180",
    engagement: 11.4,
    status: "PUBLISHED",
    followersImpact: 2200,
    monthIndex: 4, // May/Jun
  },
  {
    id: 3,
    title: "Studio Paradigm Brand Manifesto Announcement",
    platform: "LinkedIn",
    date: "Jul 20, 2026",
    impressions: "29,100",
    likes: "890",
    engagement: 7.8,
    status: "PUBLISHED",
    followersImpact: 1100,
    monthIndex: 3, // Apr
  },
  {
    id: 4,
    title: "Biking Over Bridge Structural Symmetry Showcase",
    platform: "Facebook",
    date: "Jul 15, 2026",
    impressions: "18,400",
    likes: "640",
    engagement: 5.6,
    status: "PUBLISHED",
    followersImpact: 650,
    monthIndex: 2, // Mar
  },
  {
    id: 5,
    title: "5 Lessons in Editorial Content Rhythm (Thread)",
    platform: "X (Twitter)",
    date: "Jul 10, 2026",
    impressions: "19,200",
    likes: "510",
    engagement: 6.1,
    status: "PUBLISHED",
    followersImpact: 800,
    monthIndex: 1, // Feb
  },
];

const STRICT_COLORS = ["#27251f", "#58554e", "rgba(39,37,31,0.6)", "rgba(88,85,78,0.4)"];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip font-mono">
        <p className="tt-label">{label}</p>
        <p className="tt-value">{payload[0].value.toLocaleString()} Metric Units</p>
      </div>
    );
  }
  return null;
}

function Analytics() {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState("ALL");
  const postsList = initialPosts;

  // Filter posts based on selected platform
  const filteredPosts = useMemo(() => {
    if (selectedPlatform === "ALL") return postsList;
    return postsList.filter(
      (p) => p.platform.toLowerCase().includes(selectedPlatform.toLowerCase())
    );
  }, [selectedPlatform, postsList]);

  // Compute graph data dynamically based on filtered posts!
  const dynamicGraphData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const baseMultiplier = selectedPlatform === "ALL" ? 1 : selectedPlatform === "LinkedIn" ? 0.45 : selectedPlatform === "Instagram" ? 0.3 : 0.15;

    return months.map((month, idx) => {
      const postsInMonth = filteredPosts.filter((p) => p.monthIndex === idx);
      const postMultiplier = postsInMonth.length > 0 ? postsInMonth.length * 1.3 : 1;
      const calculatedVal = Math.round((2000 + idx * 1800) * baseMultiplier * postMultiplier);
      return {
        month,
        value: calculatedVal,
        postsCount: postsInMonth.length,
      };
    });
  }, [filteredPosts, selectedPlatform]);

  // Calculate dynamic header stats
  const totalPostsCount = filteredPosts.length;
  const avgEngagement = useMemo(() => {
    if (filteredPosts.length === 0) return "0%";
    const sum = filteredPosts.reduce((acc, p) => acc + p.engagement, 0);
    return (sum / filteredPosts.length).toFixed(1) + "%";
  }, [filteredPosts]);

  const totalImpressionsSum = useMemo(() => {
    return filteredPosts
      .reduce((acc, p) => acc + parseInt(p.impressions.replace(/,/g, "")), 0)
      .toLocaleString();
  }, [filteredPosts]);

  // Dynamic Pie distribution data
  const dynamicPieData = useMemo(() => {
    if (selectedPlatform !== "ALL") {
      return [
        { name: "Brand Narrative", value: 42 },
        { name: "Visual Storytelling", value: 33 },
        { name: "Campaign Momentum", value: 25 },
      ];
    }
    return [
      { name: "LinkedIn", value: 45 },
      { name: "Instagram", value: 30 },
      { name: "Facebook", value: 15 },
      { name: "X (Twitter)", value: 10 },
    ];
  }, [selectedPlatform]);

  const pieChartTitle = selectedPlatform === "ALL" ? "Platform Share" : "Post Topic Share";

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="page-header hairline-b">
        <div>
          <span className="eyebrow-text font-mono">PERFORMANCE AUDIT</span>
          <h1 className="page-title font-serif">
              {user.role} Analytics
          </h1>

          <p className="page-subtitle">
              Welcome {user.name}. Showing analytics available for the {user.role} role.
          </p>
        </div>

        <div className="analytics-summary-badge font-mono">
          <span>ACTIVE FILTER: {selectedPlatform} PLATFORM(S)</span>
        </div>
      </div>

      {/* Platform Filter Selector */}
      <div className="filter-bar-row hairline-b font-mono">
        <span className="filter-label">FILTER CHANNEL DATA:</span>
        <div className="filter-options">
          {["ALL", "LinkedIn", "Instagram", "Facebook", "X"].map((plat) => (
            <button
              key={plat}
              className={`filter-btn ${selectedPlatform === plat ? "is-active" : ""}`}
              onClick={() => setSelectedPlatform(plat)}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Top Stat Highlights (NO BOX CARDS) */}
      <div className="analytics-metrics-row hairline-b">

        {user.role === "Administrator" && (
          <>
            <div className="metric-box">
              <span className="m-tag font-mono">TOTAL USERS</span>
              <span className="m-number font-serif">125</span>
              <span className="m-sub font-mono">
                Registered users
              </span>
            </div>

            <div className="metric-box">
              <span className="m-tag font-mono">ACTIVE USERS</span>
              <span className="m-number font-serif">84</span>
              <span className="m-sub font-mono">
                Online today
              </span>
            </div>

            <div className="metric-box">
              <span className="m-tag font-mono">SYSTEM HEALTH</span>
              <span className="m-number font-serif">99.9%</span>
              <span className="m-sub font-mono">
                Platform uptime
              </span>
            </div>
          </>
        )}

        {user.role === "Business User" && (
          <>
            <div className="metric-box">
              <span className="m-tag font-mono">TOTAL POSTS</span>
              <span className="m-number font-serif">{totalPostsCount}</span>
              <span className="m-sub font-mono">
                Published posts
              </span>
            </div>

            <div className="metric-box">
              <span className="m-tag font-mono">
                ENGAGEMENT
              </span>
              <span className="m-number font-serif">
                {avgEngagement}
              </span>
              <span className="m-sub font-mono">
                Average rate
              </span>
            </div>

            <div className="metric-box">
              <span className="m-tag font-mono">
                IMPRESSIONS
              </span>
              <span className="m-number font-serif">
                {totalImpressionsSum}
              </span>
              <span className="m-sub font-mono">
                Total reach
              </span>
            </div>
          </>
        )}

        {user.role === "Marketing Team" && (
          <>
            <div className="metric-box">
              <span className="m-tag font-mono">
                ACTIVE CAMPAIGNS
              </span>
              <span className="m-number font-serif">
                12
              </span>
              <span className="m-sub font-mono">
                Running now
              </span>
            </div>

            <div className="metric-box">
              <span className="m-tag font-mono">
                REACH
              </span>
              <span className="m-number font-serif">
                248K
              </span>
              <span className="m-sub font-mono">
                Campaign audience
              </span>
            </div>

            <div className="metric-box">
              <span className="m-tag font-mono">
                CONVERSIONS
              </span>
              <span className="m-number font-serif">
                1,240
              </span>
              <span className="m-sub font-mono">
                Successful conversions
              </span>
            </div>
          </>
        )}

        {user.role === "Content Creator" && (
          <>
            <div className="metric-box">
              <span className="m-tag font-mono">
                POSTS CREATED
              </span>
              <span className="m-number font-serif">
                {totalPostsCount}
              </span>
              <span className="m-sub font-mono">
                Created by you
              </span>
            </div>

            <div className="metric-box">
              <span className="m-tag font-mono">
                ENGAGEMENT
              </span>
              <span className="m-number font-serif">
                {avgEngagement}
              </span>
              <span className="m-sub font-mono">
                Personal engagement
              </span>
            </div>

            <div className="metric-box">
              <span className="m-tag font-mono">
                IMPRESSIONS
              </span>
              <span className="m-number font-serif">
                {totalImpressionsSum}
              </span>
              <span className="m-sub font-mono">
                Personal reach
              </span>
            </div>
          </>
        )}

      </div>

      {/* Dynamic Graphs Section */}
      <div className="analytics-charts-grid">
        {/* Growth Chart Column */}
        <div className="chart-column hairline-r">
          <div className="chart-header-row hairline-b">
            <div className="title-with-icon">
              <BarChart3 size={18} />
              <h2 className="chart-heading font-serif">
                Growth Curve ({selectedPlatform})
              </h2>
            </div>
            <span className="chart-badge font-mono">DYNAMIC DATA</span>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dynamicGraphData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(88,85,78,0.15)" vertical={false} />
                <XAxis dataKey="month" stroke="#58554e" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#58554e" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#27251f"
                  strokeWidth={3}
                  dot={{ fill: "#27251f", r: 4 }}
                  activeDot={{ r: 7, fill: "#ffffff", stroke: "#27251f", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Pie Column */}
        <div className="chart-column">
          <div className="chart-header-row hairline-b">
            <div className="title-with-icon">
              <PieIcon size={18} />
              <h2 className="chart-heading font-serif">{pieChartTitle}</h2>
            </div>
            <span className="chart-badge font-mono">DISTRIBUTION</span>
          </div>

          <div className="chart-wrap pie-chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={dynamicPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {dynamicPieData.map((entry, index) => (
                    <Cell key={index} fill={STRICT_COLORS[index % STRICT_COLORS.length]} stroke="var(--c-cream)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Pie Legend */}
            <div className="pie-legend-grid">
              {dynamicPieData.map((item, idx) => (
                <div key={item.name} className="legend-item font-mono">
                  <span className="legend-color-dot" style={{ backgroundColor: STRICT_COLORS[idx % STRICT_COLORS.length] }}></span>
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-val">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Made Section (Below Graphs) */}
      <div className="posts-made-section hairline-t">
        <div className="section-title-row hairline-b">
          <div className="title-with-icon">
            <Layers size={20} />
            <h2 className="section-heading font-serif">{user.role} Activity</h2>
          </div>
          <span className="section-count font-mono">
            {user.role} • {filteredPosts.length} RECORDS
          </span>
        </div>

        <div className="posts-table-header hairline-b font-mono">
          <span className="col-p-title">POST TITLE & EDITORIAL HEADLINE</span>
          <span className="col-p-plat">PLATFORM</span>
          <span className="col-p-date">PUBLISHED DATE</span>
          <span className="col-p-imp-header">IMPRESSIONS</span>
          <span className="col-p-eng">ENGAGEMENT</span>
          <span className="col-p-status">STATUS</span>
        </div>

        <div className="posts-flat-list">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-flat-row hairline-b">
              <div className="col-p-title">
                <span className="post-headline">{post.title}</span>
              </div>

              <div className="col-p-plat">
                <span className="plat-tag font-mono">{post.platform}</span>
              </div>

              <div className="col-p-date font-mono">
                <span>{post.date}</span>
              </div>

              <div className="col-p-imp font-serif">
                <span>{post.impressions}</span>
              </div>

              <div className="col-p-eng font-mono">
                <span className="eng-rate">{post.engagement}%</span>
                <span className="likes-sub">{post.likes} likes</span>
              </div>

              <div className="col-p-status font-mono">
                <span className="status-pill completed">{post.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;