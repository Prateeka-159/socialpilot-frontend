import "./Accounts.css";

const accounts = [
  {
    id: 1,
    name: "Luna Labs",
    platform: "LinkedIn, Instagram",
    status: "Connected",
    managers: 3,
  },
  {
    id: 2,
    name: "Orion Ventures",
    platform: "Facebook, X",
    status: "Pending Setup",
    managers: 2,
  },
  {
    id: 3,
    name: "Moss Media",
    platform: "LinkedIn, Instagram, X",
    status: "Connected",
    managers: 5,
  },
];

export default function Accounts() {
  return (
    <div className="accounts-page">
      <header className="business-page-header">
        <div>
          <p className="eyebrow-text">BUSINESS USER</p>
          <h1>Accounts</h1>
          <p className="page-copy">
            Manage multiple business accounts, onboarding status, and campaign access from one dashboard.
          </p>
        </div>
        <button className="primary-button">Add Business Account</button>
      </header>

      <section className="accounts-grid">
        {accounts.map((account) => (
          <article key={account.id} className="account-card">
            <div className="account-card-top">
              <h2>{account.name}</h2>
              <span className={`account-status ${account.status === "Connected" ? "connected" : "pending"}`}>
                {account.status}
              </span>
            </div>
            <p className="account-detail"><strong>Platforms:</strong> {account.platform}</p>
            <p className="account-detail"><strong>Managers:</strong> {account.managers}</p>
            <div className="card-actions">
              <button className="secondary-button">View Account</button>
              <button className="secondary-button muted">Update</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
