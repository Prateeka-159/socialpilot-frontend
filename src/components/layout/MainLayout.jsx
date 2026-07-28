import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./MainLayout.css";

function MainLayout() {
  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default MainLayout;