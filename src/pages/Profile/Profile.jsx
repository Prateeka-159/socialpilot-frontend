import { useState } from "react";
import {
  Mail,
  Shield,
  Phone,
  MapPin,
  Pencil,
  Check,
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Vance",
    role: "Head of Social Media Architecture",
    email: "alex.vance@studio-sp.com",
    phone: "+1 (555) 234-8901",
    location: "New York, USA // Studio HQ",
    bio: "Curating multi-platform editorial presence, high-velocity campaign scheduling, and visual brand identity.",
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      {/* Cover Photography Hero Frame */}
      <div className="profile-cover-frame hairline-b">
        <img
          src="/ripples-of-sand-in-black-and-white.jpg"
          alt="Profile cover photography"
          className="cover-photo"
        />
        <div className="cover-shade"></div>
        <div className="cover-tag font-mono">PROFILE OVERVIEW</div>
      </div>

      {/* Profile Header Row */}
      <div className="profile-header-row hairline-b">
        <div className="avatar-frame">
          <img
            src="/images.jpg"
            alt="Alex Vance"
            className="avatar-photo"
          />
          <span className="online-indicator"></span>
        </div>

        <div className="profile-title-block">
          {isEditing ? (
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="edit-name-input font-serif"
            />
          ) : (
            <h1 className="profile-name font-serif">{profile.name}</h1>
          )}
          <p className="profile-role font-mono">{profile.role}</p>
        </div>

        <div className="profile-header-action">
          {isEditing ? (
            <button className="sp-dark-btn" onClick={handleSave}>
              <Check size={16} />
              <span>Save Changes</span>
            </button>
          ) : (
            <button className="sp-btn-outline" onClick={() => setIsEditing(true)}>
              <Pencil size={15} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Bio Statement */}
      <div className="profile-bio-row hairline-b">
        <span className="bio-label font-mono">EDITORIAL MANIFESTO</span>
        {isEditing ? (
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="bare-textarea"
            rows={2}
          />
        ) : (
          <p className="bio-text font-serif">"{profile.bio}"</p>
        )}
      </div>

      {/* Open Details List (NO BOX CARDS!) */}
      <div className="profile-details-grid">
        <div className="detail-flat-row hairline-b">
          <div className="detail-label-side font-mono">
            <Mail size={16} />
            <span>EMAIL ADDRESS</span>
          </div>
          <div className="detail-value-side">
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="bare-input"
              />
            ) : (
              <span className="value-text">{profile.email}</span>
            )}
          </div>
        </div>

        <div className="detail-flat-row hairline-b">
          <div className="detail-label-side font-mono">
            <Phone size={16} />
            <span>PHONE DIRECT</span>
          </div>
          <div className="detail-value-side">
            {isEditing ? (
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="bare-input"
              />
            ) : (
              <span className="value-text">{profile.phone}</span>
            )}
          </div>
        </div>

        <div className="detail-flat-row hairline-b">
          <div className="detail-label-side font-mono">
            <Shield size={16} />
            <span>ACCESS LEVEL</span>
          </div>
          <div className="detail-value-side">
            <span className="value-text badge-value font-mono">ADMINISTRATOR // SUPERUSER</span>
          </div>
        </div>

        <div className="detail-flat-row hairline-b">
          <div className="detail-label-side font-mono">
            <MapPin size={16} />
            <span>PRIMARY LOCATION</span>
          </div>
          <div className="detail-value-side">
            {isEditing ? (
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="bare-input"
              />
            ) : (
              <span className="value-text">{profile.location}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;