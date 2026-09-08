import { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Sparkles,
  Layers,
  CheckCircle,
  FileText,
  Paperclip,
  X,
} from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { getAccounts } from "../../services/socialService";
import { createPost, getPosts } from "../../services/postService";
import "./Scheduler.css";

const PLATFORM_KEYS = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter",
};

function Scheduler() {
  const [attachedFile, setAttachedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["linkedin"]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [queuedPosts, setQueuedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      const [accountData, postData] = await Promise.all([
        getAccounts(),
        getPosts(),
      ]);

      setAccounts(accountData.accounts || []);
      setQueuedPosts(
        (postData.posts || []).filter((post) =>
          ["SCHEDULED", "QUEUED", "DRAFT"].includes(post.status)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const togglePlatform = (key) => {
    setSelectedPlatforms((prev) =>
      prev.includes(key) ? prev.filter((platform) => platform !== key) : [...prev, key]
    );
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Attached documents must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setAttachedFile(file);
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  const getPlatformIcon = (platformName) => {
    switch (platformName?.toLowerCase()) {
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

  const findAccountForPlatform = (platformKey) => {
    const platformName = PLATFORM_KEYS[platformKey];

    return accounts.find(
      (account) => account.platform.toLowerCase() === platformName.toLowerCase()
    );
  };

  const handleQueuePost = async (event) => {
    event.preventDefault();

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      alert("Please choose a publish date and time.");
      return;
    }

    const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00`;

    try {
      setSubmitting(true);
      setError("");

      for (const platformKey of selectedPlatforms) {
        const account = findAccountForPlatform(platformKey);

        if (!account) {
          throw new Error(
            `Connect your ${PLATFORM_KEYS[platformKey]} account before scheduling.`
          );
        }

        await createPost({
          social_account_id: account.id,
          caption,
          title: caption.slice(0, 80),
          scheduled_time: scheduledDateTime,
          image: attachedFile,
        });
      }

      await loadData();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="scheduler-page">
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
        </div>
      </div>

      {showSuccess && (
        <div className="success-toast font-mono">
          <CheckCircle size={16} />
          <span>Post scheduled and appended to current queue successfully!</span>
        </div>
      )}

      {error && (
        <p style={{ color: "#dc2626", padding: "0 0 1rem 0" }}>{error}</p>
      )}

      <div className="scheduler-grid">
        <div className="composer-column hairline-r">
          <div className="column-title-row hairline-b">
            <Sparkles size={18} />
            <h2 className="column-heading font-serif">Compose New Broadcast</h2>
          </div>

          <form onSubmit={handleQueuePost} className="composer-form">
            <div className="form-section">
              <span className="form-label font-mono">SELECT TARGET PLATFORMS</span>
              <div className="platform-toggle-row">
                {["linkedin", "instagram", "facebook", "twitter"].map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    className={`plat-toggle-btn ${selectedPlatforms.includes(platform) ? "is-selected" : ""}`}
                    onClick={() => togglePlatform(platform)}
                  >
                    {getPlatformIcon(platform)}
                    <span>{PLATFORM_KEYS[platform]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <span className="form-label font-mono">CAPTION & EDITORIAL BODY</span>
              <textarea
                rows={4}
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Write your editorial caption here..."
                className="bare-textarea hairline-b"
                required
              />
            </div>

            <div className="form-section">
              <span className="form-label font-mono">ATTACH YOUR DOCUMENT</span>
              <div className="document-attachment">
                <label htmlFor="document-upload" className="document-upload-label">
                  <Paperclip size={18} />
                  <span>{attachedFile ? "Replace document" : "Choose from local computer"}</span>
                </label>
                <input
                  id="document-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.ppt,.pptx,image/*"
                  onChange={handleFileChange}
                  className="document-upload-input"
                />

                {attachedFile ? (
                  <div className="attached-document-row">
                    <FileText size={18} />
                    <span className="attached-document-name" title={attachedFile.name}>
                      {attachedFile.name}
                    </span>
                    <span className="attached-document-size font-mono">
                      {(attachedFile.size / 1024).toFixed(0)} KB
                    </span>
                    <button
                      type="button"
                      className="remove-document-button"
                      onClick={removeAttachedFile}
                      aria-label="Remove attached document"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <span className="document-helper-text">Optional · PDF, Word, spreadsheet, text, presentation, or image · Max 5 MB</span>
                )}
              </div>
            </div>

            <div className="form-section timing-row hairline-t">
              <div className="time-field">
                <span className="form-label font-mono">PUBLISH DATE</span>
                <div className="inline-input-wrap">
                  <CalendarIcon size={16} />
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(event) => setScheduledDate(event.target.value)}
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
                    onChange={(event) => setScheduledTime(event.target.value)}
                    className="bare-input"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="sp-primary-submit" disabled={submitting}>
              <Send size={16} />
              <span>{submitting ? "Scheduling..." : "Add to Publication Queue"}</span>
            </button>
          </form>
        </div>

        <div className="timeline-column">
          <div className="column-title-row hairline-b">
            <Layers size={18} />
            <h2 className="column-heading font-serif">Queued Publications</h2>
          </div>

          {loading ? (
            <p>Loading scheduled posts...</p>
          ) : (
            <div className="queue-flat-list">
              {queuedPosts.length === 0 ? (
                <p>No scheduled posts yet.</p>
              ) : (
                queuedPosts.map((post) => {
                  const account = accounts.find(
                    (item) => item.id === post.social_account_id
                  );

                  return (
                    <div key={post.post_id} className="queue-flat-row hairline-b">
                      <div className="queue-thumb-wrap">
                        <FileText size={28} />
                      </div>

                      <div className="queue-content-wrap">
                        <div className="queue-meta-row font-mono">
                          <span className="queue-date">
                            {post.scheduled_time
                              ? new Date(post.scheduled_time).toLocaleString()
                              : "Draft"}
                          </span>
                          <div className="queue-icons">
                            {getPlatformIcon(account?.platform)}
                          </div>
                        </div>

                        <p className="queue-caption">{post.caption}</p>

                        <div className="queue-footer-row font-mono">
                          <span className={`status-pill ${post.status.toLowerCase()}`}>
                            {post.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Scheduler;
