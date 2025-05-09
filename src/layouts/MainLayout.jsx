import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./MainLayout.css"; // eğer varsa

import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
