import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.scss";
import logo from "../../assets/logo.svg";

function Navbar() {
  return (
    <div className="nav-wrapper">
      <div className="logo-container">
        <img src={logo} alt="" />
      </div>
      <div className="nav-links-wrapper">
        <NavLink className="nav-link" to="/dashboard">
          <p className="nav-txt">Home</p>
        </NavLink>
        <NavLink className="nav-link" to="/medications">
          <p className="nav-txt">Medications</p>
        </NavLink>
        <NavLink className="nav-link" to="/schedule">
          <p className="nav-txt">Schedule</p>
        </NavLink>
      </div>
      <div className="space"></div>
      <div className="profile-circle"></div>
    </div>
  );
}

export default Navbar;
