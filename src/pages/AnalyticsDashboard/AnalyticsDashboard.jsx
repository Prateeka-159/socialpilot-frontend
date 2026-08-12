import { useState } from 'react';
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
} from 'recharts';
import './AnalyticsDashboard.css';

const analyticsData = [
  { day: 'Mon', impressions: 2400, engagement: 400, clicks: 120 },
  { day: 'Tue', impressions: 1398, engagement: 300, clicks: 80 },
  { day: 'Wed', impressions: 9800, engagement: 2000, clicks: 650 },
  { day: 'Thu', impressions: 3908, engagement: 2780, clicks: 310 },
  { day: 'Fri', impressions: 4800, engagement: 1890, clicks: 420 },
  { day: 'Sat', impressions: 3800, engagement: 2390, clicks: 300 },
  { day: 'Sun', impressions: 4300, engagement: 3490, clicks: 510 },
];

export default function AnalyticsDashboard() {
  const [metric, setMetric] = useState('impressions');

  // Dynamic titles and labels based on the selected metric filter
  const getMetricTitle = () => {
    switch (metric) {
      case 'engagement':
        return 'Engagement';
      case 'clicks':
        return 'Link Clicks';
      case 'impressions':
      default:
        return 'Impressions';
    }
  };

  return (
    <div style={{ padding: '32px', color: '#111111', backgroundColor: '#f9f8f6', minHeight: '100vh', boxSizing: 'border-box' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.1em', color: '#444444', textTransform: 'uppercase', fontWeight: '700' }}>PERFORMANCE METRICS</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '4px 0 0 0', color: '#000000', letterSpacing: '-0.02em' }}>Interactive Analytics</h2>
          <p style={{ fontSize: '14px', color: '#444444', marginTop: '4px', margin: 0, fontWeight: '500' }}>
            Real-time engagement trends and campaign performance metrics.
          </p>
        </div>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cccccc',
            color: '#000000',
            fontSize: '13px',
            fontWeight: '600',
            borderRadius: '6px',
            padding: '8px 14px',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <option value="impressions">Filter: Impressions</option>
          <option value="engagement">Filter: Engagement</option>
          <option value="clicks">Filter: Clicks</option>
        </select>
      </div>

      {/* KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { title: 'Total Impressions', val: '30.4K', change: '+12.5%' },
          { title: 'Total Engagements', val: '12.8K', change: '+8.2%' },
          { title: 'Link Clicks', val: '2,390', change: '+15.1%' },
          { title: 'New Followers', val: '+850', change: '+5.4%' },
        ].map((kpi, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #dcdcdc',
              borderRadius: '8px',
              padding: '18px 20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
            }}
          >
            <p style={{ fontSize: '11px', color: '#555555', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'monospace', fontWeight: '700' }}>{kpi.title}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#000000' }}>{kpi.val}</span>
              <span style={{ fontSize: '13px', color: '#15803d', fontWeight: '700' }}>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Line Chart */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #dcdcdc', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#000000', margin: '0 0 20px 0' }}>
            Daily {getMetricTitle()} Trend
          </p>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="day" stroke="#333333" fontSize={12} tickLine={false} />
                <YAxis stroke="#333333" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cccccc', color: '#000000', fontSize: '12px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey={metric} stroke="#000000" strokeWidth={2.5} dot={{ fill: '#000000', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #dcdcdc', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#000000', margin: '0 0 20px 0' }}>
            Daily {getMetricTitle()} Distribution
          </p>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="day" stroke="#333333" fontSize={12} tickLine={false} />
                <YAxis stroke="#333333" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cccccc', color: '#000000', fontSize: '12px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey={metric} fill="#222222" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}