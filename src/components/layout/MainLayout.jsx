import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="sp-app-wrapper">
      <Sidebar />
      <Navbar />
      <main className="sp-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;