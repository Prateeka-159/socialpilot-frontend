import { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Shield,
  Phone,
  MapPin,
  Pencil,
} from "lucide-react";
import "./Profile.css";
import { getProfile } from "../../services/profileService";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProfile();
      setProfile(data);
    };

    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          fontSize: "22px",
          fontWeight: "600",
          color: "#2563eb",
        }}
      >
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <UserCircle size={90} color="white" />
          </div>

          <div>
            <h1>{profile.name}</h1>
            <p>{profile.role}</p>

            <button className="edit-btn">
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-box">
            <Mail size={22} />
            <div>
              <h4>Email</h4>
              <p>{profile.email}</p>
            </div>
          </div>

          <div className="info-box">
            <Phone size={22} />
            <div>
              <h4>Phone</h4>
              <p>{profile.phone}</p>
            </div>
          </div>

          <div className="info-box">
            <Shield size={22} />
            <div>
              <h4>Role</h4>
              <p>{profile.role}</p>
            </div>
          </div>

          <div className="info-box">
            <MapPin size={22} />
            <div>
              <h4>Location</h4>
              <p>{profile.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;