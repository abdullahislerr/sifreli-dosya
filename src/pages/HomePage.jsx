import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UploadPage from "./UploadPage";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page-layout">
      <Sidebar />
      <div className="home-page-content">
        <Header />
        <div className="home-page-body">
        <UploadPage />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
