import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import SocialAccounts from "../pages/SocialAccounts/SocialAccounts";
import Scheduler from "../pages/Scheduler/Scheduler";
import Analytics from "../pages/Analytics/Analytics";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";

import MainLayout from "../components/layout/MainLayout";

function AppRoutes() {
  return (
    <Routes>

      {/* Public Pages */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Pages */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/social-accounts" element={<SocialAccounts />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;