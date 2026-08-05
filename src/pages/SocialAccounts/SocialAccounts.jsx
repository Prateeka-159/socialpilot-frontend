import React, { useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Plus } from "lucide-react";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./SocialAccounts.css";

function SocialAccounts() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "LinkedIn Studio",
      handle: "@studio-paradigm",
      icon: <FaLinkedin size={26} />,
      connected: true,
      followers: "8,420",
      posts: "54",
      engagement: "7.2%",
      lastSync: "Today, 10:30 AM",
    },
    {
      id: 2,
      name: "Instagram Editorial",
      handle: "@studio.paradigm",
      icon: <FaInstagram size={26} />,
      connected: true,
      followers: "3,150",
      posts: "82",
      engagement: "9.4%",
      lastSync: "Today, 09:15 AM",
    },
    {
      id: 3,
      name: "Facebook Page",
      handle: "Studio Paradigm Official",
      icon: <FaFacebook size={26} />,
      connected: false,
      followers: "--",
      posts: "--",
      engagement: "--",
      lastSync: "Not connected",
    },
    {
      id: 4,
      name: "X Channel",
      handle: "@studioparadigm",
      icon: <FaXTwitter size={26} />,
      connected: false,
      followers: "--",
      posts: "--",
      engagement: "--",
      lastSync: "Not connected",
    },
  ]);

  const toggleConnection = (id) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              connected: !acc.connected,
              followers: acc.connected ? "--" : "8,420",
              posts: acc.connected ? "--" : "54",
              engagement: acc.connected ? "--" : "7.2%",
              lastSync: acc.connected ? "Not connected" : "Just now",
            }
          : acc
      )
    );
  };

  return (
    <div className="social-accounts-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <span className="eyebrow-text font-mono">CHANNEL ARCHITECTURE</span>
          <h1 className="page-title font-serif">Platform Integrations</h1>
          <p className="page-subtitle">
            Synchronize your social media networks into a unified editorial workflow.
          </p>
        </div>

        <button className="sp-dark-btn">
          <Plus size={16} />
          <span>Connect Custom Webhook</span>
        </button>
      </div>

      {/* Sync Status Banner Bar (Without Images) */}
      <div className="accounts-sync-bar hairline-b font-mono">
        <div className="sync-bar-left">
          <RefreshCw size={14} className="spin-icon" />
          <span>API PIPELINE ACTIVE // 11,570 AGGREGATE AUDIENCE SYNCHRONIZED</span>
        </div>
        <div className="sync-bar-right">
          <span>LAST SYNC CHECK: JUST NOW</span>
        </div>
      </div>

      {/* Accounts List (Flat Editorial Rows - NO BOXES/CARDS) */}
      <div className="accounts-list-container">
        <div className="list-table-header hairline-b font-mono">
          <span className="col-platform">CHANNEL / HANDLE</span>
          <span className="col-stats">METRICS (FOLLOWERS / POSTS / ENG)</span>
          <span className="col-status">SYNC STATUS</span>
          <span className="col-action">ACTION</span>
        </div>

        {accounts.map((account) => (
          <div className="account-flat-row hairline-b" key={account.id}>
            <div className="col-platform account-identity">
              <div className="account-names">
                <span className="acc-name">{account.name}</span>
                <span className="acc-handle font-mono">{account.handle}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="col-stats account-metrics">
              <div className="metric-pill">
                <span className="m-val font-serif">{account.followers}</span>
                <span className="m-lbl font-mono">FOLLOWERS</span>
              </div>
              <div className="metric-pill">
                <span className="m-val font-serif">{account.posts}</span>
                <span className="m-lbl font-mono">POSTS</span>
              </div>
              <div className="metric-pill">
                <span className="m-val font-serif">{account.engagement}</span>
                <span className="m-lbl font-mono">ENGAGEMENT</span>
              </div>
            </div>

            {/* Sync Status */}
            <div className="col-status account-status">
              {account.connected ? (
                <div className="status-label-connected font-mono">
                  <CheckCircle2 size={15} />
                  <span>CONNECTED</span>
                </div>
              ) : (
                <div className="status-label-disconnected font-mono">
                  <XCircle size={15} />
                  <span>DISCONNECTED</span>
                </div>
              )}
              <span className="sync-time font-mono">Last sync: {account.lastSync}</span>
            </div>

            {/* Action */}
            <div className="col-action account-action">
              <button
                className={account.connected ? "sp-btn-outline" : "sp-btn-solid"}
                onClick={() => toggleConnection(account.id)}
              >
                {account.connected ? "Disconnect" : "Connect Channel"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SocialAccounts;