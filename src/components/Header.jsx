import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="header-container">
      <h3 className="header-title">Şifreli Dosya Sistemi</h3>

      {user && (
        <div className="header-user-wrapper">
          <div className="header-user" onClick={toggleDropdown}>
            {user.displayName}
          </div>

          {dropdownOpen && (
            <div className="header-dropdown">
              <button onClick={handleLogout}>Çıkış Yap</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
