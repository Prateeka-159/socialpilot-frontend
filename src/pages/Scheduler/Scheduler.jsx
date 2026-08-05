import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Scheduler.css";

function Scheduler() {
  const [selectedMedia, setSelectedMedia] = useState("/biking-over-bridge.jpg");
  const [caption, setCaption] = useState(
    "Synthesizing architectural rhythm and structural minimalism across urban spaces. New series launching tomorrow."
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState(["linkedin", "instagram"]);
  const [scheduledDate, setScheduledDate] = useState("2026-07-30");
  const [scheduledTime, setScheduledTime] = useState("18:00");

  const publicImages = [
    { id: 1, src: "/biking-over-bridge.jpg", name: "Biking over Bridge" },
    { id: 2, src: "/images.jpg", name: "Abstract Structure" },
    { id: 3, src: "/ripples-of-sand-in-black-and-white.jpg", name: "Ripples of Sand" },
  ];

  const draftItems = [
    { id: 1, title: 'Q3 Product Roadmap Announcement', targetPlatform: 'LinkedIn', lastSaved: '10 mins ago', author: 'Alex Vance' },
    { id: 2, title: 'Cyberpunk Theme Launch Assets', targetPlatform: 'Instagram', lastSaved: '2 hours ago', author: 'Alex Vance' },
    { id: 3, title: 'Weekly Tech Insights Thread', targetPlatform: 'X (Twitter)', lastSaved: 'Yesterday', author: 'Alex Vance' },
  ];

  const togglePlatform = (key) => {
    setSelectedPlatforms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleQueuePost = (e) => {
    e.preventDefault();
    alert("Post added to SP Studio queue successfully!");
  };

  return (
    <div className="scheduler-page">
      {/* Page Header */}
      <div className="page-header hairline-b">
        <div>
          <span className="eyebrow-text font-mono">CONTENT RHYTHM</span>
          <h1 className="page-title font-serif">Editorial Scheduler</h1>
          <p className="page-subtitle">
            Draft, attach media, and broadcast scheduled posts across all connected networks.
          </p>
        </div>

        <div className="header-meta font-mono">
          <span>ACTIVE QUEUE: 03 POSTS</span>
          <span>·</span>
          <span>NEXT: TOMORROW 18:00 UTC</span>
        </div>
      </div>

      {/* Scheduler Split Studio Canvas (No Box Cards) */}
      <div className="scheduler-grid">
        {/* Left Column: Composer Studio */}
        <div className="composer-column hairline-r">
          <div className="column-title-row hairline-b">
            <Sparkles size={18} />
            <h2 className="column-heading font-serif">Compose New Broadcast</h2>
          </div>

          <form onSubmit={handleQueuePost} className="composer-form">
            {/* Target Networks selection */}
            <div className="form-section">
              <span className="form-label font-mono">SELECT TARGET PLATFORMS</span>
              <div className="platform-toggle-row">
                <button
                  type="button"
                  className={`plat-toggle-btn ${selectedPlatforms.includes("linkedin") ? "is-selected" : ""}`}
                  onClick={() => togglePlatform("linkedin")}
                >
                  <FaLinkedin size={16} />
                  <span>LinkedIn</span>
                </button>

                <button
                  type="button"
                  className={`plat-toggle-btn ${selectedPlatforms.includes("instagram") ? "is-selected" : ""}`}
                  onClick={() => togglePlatform("instagram")}
                >
                  <FaInstagram size={16} />
                  <span>Instagram</span>
                </button>

                <button
                  type="button"
                  className={`plat-toggle-btn ${selectedPlatforms.includes("facebook") ? "is-selected" : ""}`}
                  onClick={() => togglePlatform("facebook")}
                >
                  <FaFacebook size={16} />
                  <span>Facebook</span>
                </button>

                <button
                  type="button"
                  className={`plat-toggle-btn ${selectedPlatforms.includes("twitter") ? "is-selected" : ""}`}
                  onClick={() => togglePlatform("twitter")}
                >
                  <FaXTwitter size={16} />
                  <span>X (Twitter)</span>
                </button>
              </div>
            </div>

            {/* Caption Textarea */}
            <div className="form-section">
              <span className="form-label font-mono">CAPTION & EDITORIAL BODY</span>
              <textarea
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your editorial caption here..."
                className="bare-textarea hairline-b"
              />
            </div>

            {/* Media Asset Selector */}
            <div className="form-section">
              <span className="form-label font-mono">ADD PICTURES:</span>
              <div className="media-selector-grid">
                {publicImages.map((img) => (
                  <div
                    key={img.id}
                    className={`media-select-thumb ${selectedMedia === img.src ? "thumb-selected" : ""}`}
                    onClick={() => setSelectedMedia(img.src)}
                  >
                    <img src={img.src} alt={img.name} />
                    <span className="thumb-caption font-mono">{img.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timing Inputs */}
            <div className="form-section timing-row hairline-t">
              <div className="time-field">
                <span className="form-label font-mono">PUBLISH DATE</span>
                <div className="inline-input-wrap">
                  <CalendarIcon size={16} />
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="bare-input"
                  />
                </div>
              </div>

              <div className="time-field">
                <span className="form-label font-mono">TIME (UTC)</span>
                <div className="inline-input-wrap">
                  <Clock size={16} />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bare-input"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="sp-primary-submit">
              <Send size={16} />
              <span>Add to Publication Queue</span>
            </button>
          </form>
        </div>

        <div className="drafts-column">
          <div className="column-title-row hairline-b">
            <Sparkles size={18} />
            <h2 className="column-heading font-serif">Drafts</h2>
          </div>

          <div className="drafts-header">
            <div>
              <h3 className="drafts-heading">Saved drafts</h3>
              <p className="drafts-subtitle">Quickly review your drafts and keep the queue full.</p>
            </div>
            <button className="new-draft-btn">+ Create Draft</button>
          </div>

          <div className="drafts-cards-grid">
            {draftItems.map((item) => (
              <article key={item.id} className="draft-card">
                <div className="draft-card-main">
                  <div className="draft-card-top">
                    <h3 className="draft-card-title">{item.title}</h3>
                    <span className="draft-chip">Draft</span>
                  </div>
                  <div className="draft-meta-row">
                    <span className="platform-tag">{item.targetPlatform}</span>
                    <span className="draft-author">{item.author}</span>
                  </div>
                  <p className="sub-text">Last saved {item.lastSaved}</p>
                </div>
                <div className="draft-card-actions">
                  <button className="action-btn edit-btn">Edit</button>
                  <button className="action-btn delete-btn">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scheduler;