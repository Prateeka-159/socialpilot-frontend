import './Queue.css';

const QUEUE_ITEMS = [
  { id: 1, scheduledTime: '06:00 PM - Today', content: 'Scheduled visual reel broadcast for 18:00 UTC', status: 'Queued' },
  { id: 2, scheduledTime: '09:00 AM - Tomorrow', content: 'Weekly cross-platform performance breakdown', status: 'Queued' },
];

export default function Queue() {
  return (
    <div className="queue-container">
      <h2>Publishing Queue</h2>
      <div className="queue-list">
        {QUEUE_ITEMS.map((item) => (
          <div key={item.id} className="queue-item">
            <div className="queue-time">{item.scheduledTime}</div>
            <div className="queue-body">{item.content}</div>
            <span className="queue-badge">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}