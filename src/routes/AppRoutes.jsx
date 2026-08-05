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
import ProtectedRoute from "./ProtectedRoute";
import UserManagement from "../pages/UserManagement/UserManagement";

function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<MainLayout />}>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Business User",
                "Marketing Team",
                "Content Creator",
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
                "Administrator",
                "Business User",
                "Marketing Team",
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
                "Administrator",
                "Business User",
                "Marketing Team",
                "Content Creator",
              ]}
            >
              <Scheduler />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Administrator",
                "Business User",
                "Marketing Team",
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
                "Administrator",
                "Business User",
                "Marketing Team",
                "Content Creator",
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
                "Administrator",
                "Business User",
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
              allowedRoles={[
                "Administrator",
              ]}
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