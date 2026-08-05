import "./Collaborators.css";

const collaborators = [
  {
    id: 1,
    name: "Maya Alvarez",
    role: "Creative Strategist",
    email: "maya@socialpilot.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Jordan Lee",
    role: "Campaign Producer",
    email: "jordan@socialpilot.com",
    status: "Pending Invite",
  },
  {
    id: 3,
    name: "Sofia Chen",
    role: "Content Specialist",
    email: "sofia@socialpilot.com",
    status: "Active",
  },
];

export default function Collaborators() {
  return (
    <div className="collaborators-page">
      <header className="marketing-page-header">
        <div>
          <p className="eyebrow-text">MARKETING TEAM</p>
          <h1>Collaborators</h1>
          <p className="page-copy">
            Add and manage marketing collaborators, assign campaign roles, and keep everyone aligned.
          </p>
        </div>
        <button className="primary-button">Invite Collaborator</button>
      </header>

      <section className="collaborators-grid">
        {collaborators.map((collab) => (
          <article key={collab.id} className="collaborator-card">
            <div className="collab-card-top">
              <h2>{collab.name}</h2>
              <span className={`status-pill ${collab.status === "Active" ? "is-active" : "is-pending"}`}>
                {collab.status}
              </span>
            </div>
            <p className="collab-role">{collab.role}</p>
            <p className="collab-email">{collab.email}</p>
            <div className="card-actions">
              <button className="secondary-button">Edit</button>
              <button className="secondary-button muted">Remove</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
