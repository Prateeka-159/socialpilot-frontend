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

import "./Analytics.css";

const followersData = [
  { month: "Jan", followers: 2000 },
  { month: "Feb", followers: 3200 },
  { month: "Mar", followers: 4500 },
  { month: "Apr", followers: 6100 },
  { month: "May", followers: 8300 },
  { month: "Jun", followers: 12400 },
];

const platformData = [
  { name: "LinkedIn", value: 45 },
  { name: "Facebook", value: 25 },
  { name: "Instagram", value: 20 },
  { name: "X", value: 10 },
];

const COLORS = [
  "#0A66C2",
  "#1877F2",
  "#E1306C",
  "#000000",
];

function Analytics() {
  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Monitor growth and engagement across your platforms.</p>
      </div>

      <div className="analytics-grid">

        <div className="chart-card">
          <h2>Followers Growth</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={followersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="followers"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        <div className="chart-card">
          <h2>Platform Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie
                data={platformData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {platformData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default Analytics;