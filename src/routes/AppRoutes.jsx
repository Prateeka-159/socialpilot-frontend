import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import SocialAccounts from "../pages/SocialAccounts/SocialAccounts";
import Scheduler from "../pages/Scheduler/Scheduler";
import AnalyticsDashboard from "../pages/AnalyticsDashboard/AnalyticsDashboard";
import OverallAnalysis from "../pages/AnalyticsDashboard/OverallAnalysis";
import Campaigns from "../pages/Campaigns/Campaigns";
import CampaignTracker from "../pages/Campaigns/CampaignTracker";
import CampaignAnalysis from "../pages/Campaigns/CampaignAnalysis";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import Drafts from "../pages/Drafts/Drafts";
import CalendarView from "../pages/Calendar/CalendarView";
import Queue from "../pages/Queue/Queue";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/social-accounts" element={<SocialAccounts />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/analytics" element={<OverallAnalysis />} />
        <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/track/:campaignId" element={<CampaignTracker />} />
        <Route path="/campaigns/analysis/:campaignId" element={<CampaignAnalysis />} />
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
