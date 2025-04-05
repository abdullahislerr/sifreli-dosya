import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-title">Menü</h2>}
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </div>
      </div>

      {!collapsed && (
        <ul className="sidebar-list">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Ana Sayfa
            </Link>
          </li>
          <li>
            <Link
              to="/sent"
              className={location.pathname === "/sent" ? "active" : ""}
            >
              Gönderilenler
            </Link>
          </li>
          <li>
            <Link
              to="/received"
              className={location.pathname === "/received" ? "active" : ""}
            >
              Gelenler
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
