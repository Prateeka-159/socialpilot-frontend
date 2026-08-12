import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Sparkles,
  Layers,
  CheckCircle,
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
  const [scheduledDate, setScheduledDate] = useState("2026-08-15");
  const [scheduledTime, setScheduledTime] = useState("18:00");
  const [showSuccess, setShowSuccess] = useState(false);

  const publicImages = [
    { id: 1, src: "/biking-over-bridge.jpg", name: "Biking over Bridge" },
    { id: 2, src: "/images.jpg", name: "Abstract Structure" },
    { id: 3, src: "/ripples-of-sand-in-black-and-white.jpg", name: "Ripples of Sand" },
  ];

  const [queuedPosts, setQueuedPosts] = useState([
    {
      id: 101,
      date: "TOMORROW, 18:00 UTC",
      platforms: [<FaLinkedin key="l" />, <FaInstagram key="i" />],
      caption: "Synthesizing architectural rhythm and structural minimalism across urban spaces.",
      image: "/biking-over-bridge.jpg",
      status: "QUEUED",
    },
    {
      id: 102,
      date: "AUG 12, 12:30 UTC",
      platforms: [<FaInstagram key="i" />, <FaXTwitter key="x" />],
      caption: "Monochrome textures in organic movement: Sand ripples and temporal geometry.",
      image: "/ripples-of-sand-in-black-and-white.jpg",
      status: "SCHEDULED",
    },
    {
      id: 103,
      date: "AUG 14, 09:00 UTC",
      platforms: [<FaLinkedin key="l" />, <FaFacebook key="f" />],
      caption: "Case study preview on modern workflow frameworks and studio delegation.",
      image: "/images.jpg",
      status: "DRAFT",
    },
  ]);

  const togglePlatform = (key) => {
    setSelectedPlatforms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const getPlatformIcon = (key) => {
    switch (key) {
      case "linkedin":
        return <FaLinkedin key="l" />;
      case "instagram":
        return <FaInstagram key="i" />;
      case "facebook":
        return <FaFacebook key="f" />;
      case "twitter":
        return <FaXTwitter key="x" />;
      default:
        return null;
    }
  };

  const handleQueuePost = (e) => {
    e.preventDefault();

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    const newPost = {
      id: Date.now(),
      date: `${scheduledDate}, ${scheduledTime} UTC`,
      platforms: selectedPlatforms.map((p) => getPlatformIcon(p)),
      caption: caption,
      image: selectedMedia,
      status: "QUEUED",
    };

    setQueuedPosts([newPost, ...queuedPosts]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
          <span>ACTIVE QUEUE: {String(queuedPosts.length).padStart(2, "0")} POSTS</span>
          <span>·</span>
          <span>NEXT: TOMORROW 18:00 UTC</span>
        </div>
      </div>

      {showSuccess && (
        <div className="success-toast font-mono">
          <CheckCircle size={16} />
          <span>Post scheduled and appended to current queue successfully!</span>
        </div>
      )}

      {/* Scheduler Split Studio Canvas */}
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
                required
              />
            </div>

            {/* Media Asset Selector */}
            <div className="form-section">
              <span className="form-label font-mono">SELECT ATTACHED MEDIA</span>
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
                    required
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
                    required
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

        {/* Right Column: Queued Media Timeline */}
        <div className="timeline-column">
          <div className="column-title-row hairline-b">
            <Layers size={18} />
            <h2 className="column-heading font-serif">Queued Publications</h2>
          </div>

          <div className="queue-flat-list">
            {queuedPosts.map((post) => (
              <div key={post.id} className="queue-flat-row hairline-b">
                <div className="queue-thumb-wrap">
                  <img src={post.image} alt="Queued attachment" />
                </div>

                <div className="queue-content-wrap">
                  <div className="queue-meta-row font-mono">
                    <span className="queue-date">{post.date}</span>
                    <div className="queue-icons">{post.platforms}</div>
                  </div>

                  <p className="queue-caption">{post.caption}</p>

                  <div className="queue-footer-row font-mono">
                    <span className={`status-pill ${post.status.toLowerCase()}`}>
                      {post.status}
                    </span>
                    <button type="button" className="queue-edit-link">Edit Post →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scheduler;