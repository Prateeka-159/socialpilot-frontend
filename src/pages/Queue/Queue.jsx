import './Queue.css';

const QUEUE_ITEMS = [
  {
    id: 101,
    scheduledTime: 'Tomorrow • 18:00 UTC',
    headline: 'Synthesizing architectural rhythm and structural minimalism across urban spaces.',
    status: 'QUEUED',
  },
  {
    id: 102,
    scheduledTime: 'Aug 01 • 12:30 UTC',
    headline: 'Monochrome textures in organic movement: Sand ripples and temporal geometry.',
    status: 'SCHEDULED',
  },
  {
    id: 103,
    scheduledTime: 'Aug 03 • 09:00 UTC',
    headline: 'Case study preview on modern workflow frameworks and studio delegation.',
    status: 'DRAFT',
  },
];

const statusStyles = {
  QUEUED: 'badge-queued',
  SCHEDULED: 'badge-scheduled',
  DRAFT: 'badge-draft',
};

export default function Queue() {
  return (
    <div className="queue-container">
      <div className="queue-header">
        <div>
          <p className="eyebrow-text">Publication Queue</p>
          <h1 className="page-title">Queued Publication</h1>
          <p className="page-subtitle">
            Review upcoming posts, update scheduling details, and keep your content pipeline moving.
          </p>
        </div>
        <button className="queue-action-btn">+ Add Publication</button>
      </div>

      <div className="queue-list">
        {QUEUE_ITEMS.map((item) => (
          <article key={item.id} className="queue-card">
            <div className="queue-card-head">
              <span className="queue-time">{item.scheduledTime}</span>
              <span className={`queue-badge ${statusStyles[item.status]}`}>{item.status}</span>
            </div>
            <p className="queue-body">{item.headline}</p>
            <div className="queue-card-footer">
              <button className="card-btn secondary">Edit</button>
              <button className="card-btn muted">Remove</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
