import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import "./SocialAccounts.css";

function SocialAccounts() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "LinkedIn",
      icon: <FaLinkedin size={40} color="#0A66C2" />,
      connected: true,
      followers: "8.4K",
      posts: 54,
      engagement: "7.2%",
    },
    {
      id: 2,
      name: "Facebook",
      icon: <FaFacebook size={40} color="#1877F2" />,
      connected: false,
      followers: "--",
      posts: "--",
      engagement: "--",
    },
    {
      id: 3,
      name: "Instagram",
      icon: <FaInstagram size={40} color="#E1306C" />,
      connected: false,
      followers: "--",
      posts: "--",
      engagement: "--",
    },
    {
      id: 4,
      name: "X (Twitter)",
      icon: <FaXTwitter size={40} />,
      connected: false,
      followers: "--",
      posts: "--",
      engagement: "--",
    },
  ]);

  const toggleConnection = (id) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.id === id
          ? {
              ...account,
              connected: !account.connected,
              followers: account.connected ? "--" : "8.4K",
              posts: account.connected ? "--" : 54,
              engagement: account.connected ? "--" : "7.2%",
            }
          : account
      )
    );
  };

  return (
    <div className="accounts-page">
      <div className="page-header">
        <h1>Social Account Integration</h1>
        <p>
          Connect and manage all your social media accounts from one place.
        </p>
      </div>

      <div className="accounts-grid">
        {accounts.map((account) => (
          <div className="account-card" key={account.id}>
            <div className="account-top">
              {account.icon}

              <div>
                <h2>{account.name}</h2>

                {account.connected ? (
                  <span className="connected">
                    <CheckCircle2 size={16} />
                    Connected
                  </span>
                ) : (
                  <span className="disconnected">
                    <XCircle size={16} />
                    Not Connected
                  </span>
                )}
              </div>
            </div>

            <div className="stats">
              <div>
                <h3>{account.followers}</h3>
                <p>Followers</p>
              </div>

              <div>
                <h3>{account.posts}</h3>
                <p>Posts</p>
              </div>

              <div>
                <h3>{account.engagement}</h3>
                <p>Engagement</p>
              </div>
            </div>

            <button
              className={
                account.connected
                  ? "disconnect-btn"
                  : "connect-btn"
              }
              onClick={() => toggleConnection(account.id)}
            >
              {account.connected
                ? "Disconnect"
                : "Connect Account"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SocialAccounts;