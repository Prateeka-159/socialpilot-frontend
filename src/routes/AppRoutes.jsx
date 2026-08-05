import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import SocialAccounts from "../pages/SocialAccounts/SocialAccounts";
import Scheduler from "../pages/Scheduler/Scheduler";
import Analytics from "../pages/Analytics/Analytics";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import Drafts from "../pages/Drafts/Drafts";
import CalendarView from "../pages/Calendar/CalendarView";
import Queue from "../pages/Queue/Queue";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import UserManagement from "../pages/UserManagement/UserManagement";
import { ROLES } from "../utils/roles";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN,
                ROLES.BUSINESS,
                ROLES.MARKETING,
                ROLES.CONTENT_CREATOR,
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social-accounts"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN,
                ROLES.BUSINESS,
                ROLES.MARKETING,
              ]}
            >
              <SocialAccounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheduler"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN,
                ROLES.BUSINESS,
                ROLES.MARKETING,
                ROLES.CONTENT_CREATOR,
              ]}
            >
              <Scheduler />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drafts"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN,
                ROLES.BUSINESS,
                ROLES.MARKETING,
                ROLES.CONTENT_CREATOR,
              ]}
            >
              <Drafts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN,
                ROLES.BUSINESS,
                ROLES.MARKETING,
                ROLES.CONTENT_CREATOR,
              ]}
            >
              <CalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/queue"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN,
                ROLES.BUSINESS,
                ROLES.MARKETING,
                ROLES.CONTENT_CREATOR,
              ]}
            >
              <Queue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN,
                ROLES.BUSINESS,
                ROLES.MARKETING,
              ]}
            >
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN,
                ROLES.BUSINESS,
                ROLES.MARKETING,
                ROLES.CONTENT_CREATOR,
              ]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.ADMIN,
                ROLES.BUSINESS,
              ]}
            >
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN]}
            >
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;