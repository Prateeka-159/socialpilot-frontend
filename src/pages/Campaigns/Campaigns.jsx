import "./Campaigns.css";

const campaigns = [
  {
    id: 1,
    name: "Summer Launch Series",
    status: "Live",
    budget: "$24,000",
    reach: "520k",
  },
  {
    id: 2,
    name: "Influencer Growth Push",
    status: "Draft",
    budget: "$9,500",
    reach: "48k",
  },
  {
    id: 3,
    name: "Holiday Brand Refresh",
    status: "Scheduled",
    budget: "$16,200",
    reach: "312k",
  },
];

export default function Campaigns() {
  return (
    <div className="campaigns-page">
      <header className="marketing-page-header">
        <div>
          <p className="eyebrow-text">MARKETING TEAM</p>
          <h1>Manage Campaigns</h1>
          <p className="page-copy">
            Track campaign performance, edit launch plans, and publish high-impact briefs.
          </p>
        </div>
        <button className="primary-button">Create Campaign</button>
      </header>

      <section className="campaigns-table-wrapper">
        <div className="campaigns-table-header">
          <span>Campaign</span>
          <span>Status</span>
          <span>Budget</span>
          <span>Reach</span>
          <span></span>
        </div>
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-row">
            <div className="campaign-name">{campaign.name}</div>
            <div className={`campaign-status ${campaign.status.toLowerCase()}`}>{campaign.status}</div>
            <div>{campaign.budget}</div>
            <div>{campaign.reach}</div>
            <button className="secondary-button">View</button>
          </div>
        ))}
      </section>
    </div>
  );
}
