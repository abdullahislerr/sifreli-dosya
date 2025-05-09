import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Send,
  Inbox,
  Menu,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { path: "/", label: "Ana Sayfa", icon: <Home size={20} /> },
    { path: "/sent", label: "Gönderilenler", icon: <Send size={20} /> },
    { path: "/received", label: "Gelenler", icon: <Inbox size={20} /> },
  ];

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-title">Menü</h2>}
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </div>
      </div>

      <ul className="sidebar-list">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
