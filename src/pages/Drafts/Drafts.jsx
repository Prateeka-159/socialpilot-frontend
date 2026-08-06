import './Drafts.css';

const DRAFTS_DATA = [
  { id: 1, title: 'Q3 Product Roadmap Announcement', targetPlatform: 'LinkedIn', lastSaved: '10 mins ago', author: 'Alex Vance' },
  { id: 2, title: 'Cyberpunk Theme Launch Assets', targetPlatform: 'Instagram', lastSaved: '2 hours ago', author: 'Alex Vance' },
  { id: 3, title: 'Weekly Tech Insights Thread', targetPlatform: 'X (Twitter)', lastSaved: 'Yesterday', author: 'Alex Vance' },
];

export default function Drafts() {
  return (
    <div className="drafts-container">
      <div className="drafts-header">
        <h2>Drafts</h2>
        <button className="new-draft-btn">+ Create Draft</button>
      </div>
      <div className="drafts-table-wrapper">
        <table className="drafts-table">
          <thead>
            <tr>
              <th>TITLE</th>
              <th>PLATFORM</th>
              <th>LAST SAVED</th>
              <th>AUTHOR</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {DRAFTS_DATA.map((item) => (
              <tr key={item.id}>
                <td className="draft-title">{item.title}</td>
                <td><span className="platform-tag">{item.targetPlatform}</span></td>
                <td className="sub-text">{item.lastSaved}</td>
                <td className="sub-text">{item.author}</td>
                <td>
                  <button className="action-btn edit-btn">Edit</button>
                  <button className="action-btn delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}