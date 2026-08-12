import { Routes, Route } from "react-router-dom";

// Public Pages
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// Protected Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import SocialAccounts from "../pages/SocialAccounts/SocialAccounts";
import Scheduler from "../pages/Scheduler/Scheduler";
import AnalyticsDashboard from "../pages/AnalyticsDashboard/AnalyticsDashboard";
import Campaigns from "../pages/Campaigns/Campaigns";
import CampaignTracker from "../pages/Campaigns/CampaignTracker";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import Drafts from "../pages/Drafts/Drafts";
import CalendarView from "../pages/Calendar/CalendarView";
import Queue from "../pages/Queue/Queue";

// Layout
import MainLayout from "../components/layout/MainLayout";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (wrapped in MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/social-accounts" element={<SocialAccounts />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/track" element={<CampaignTracker />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/queue" element={<Queue />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;