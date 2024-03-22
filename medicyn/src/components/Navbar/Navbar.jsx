import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import logo from "../../assets/logo.svg";
import { supabase } from "../../supabasefiles/config";

function Navbar() {
  const [user, setUser] = useState();
  const [mobile, setOpenMobile] = useState(false);

  let navigate = useNavigate();

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const [userData, setUserData] = useState([]);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id);
    if (error) {
      console.log(error);
    } else {
      setUserData(data);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleClick = () => {
    setOpenMobile(!mobile);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      navigate("/");
      window.location.reload();
    }
  };

  return !mobile ? (
    <div className="nav-wrapper">
      <div className="mobile-nav">
        <div className="logo-container">
          <img src={logo} alt="" />
        </div>
        <div className="space"></div>
        <div className="hamburger" onClick={handleClick}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
      <div className="desk-nav">
        <div className="logo-container">
          <img src={logo} alt="" />
        </div>

        <div className="nav-links-wrapper">
          <NavLink className="nav-link" to="/dashboard">
            <p className="nav-txt">Home</p>
          </NavLink>
          {userData[0]?.role === "user" ? (
            <NavLink className="nav-link" to="/medications">
              <p className="nav-txt">Medications</p>
            </NavLink>
          ) : (
            <NavLink className="nav-link" to="/patients">
              <p className="nav-txt">Patients</p>
            </NavLink>
          )}
          {userData[0]?.role === "user" && (
            <NavLink className="nav-link" to="/caregivers">
              <p className="nav-txt">Caregivers</p>
            </NavLink>
          )}
        </div>
        <div className="space"></div>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  ) : (
    <div className="mobile-nav-container">
      <div className="nav-top">
        <button className="close-btn" onClick={handleClick}>
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/delete-sign--v1.png"
            alt="delete-sign--v1"
          />
        </button>
      </div>
      <div className="nav-main">
        <div className="nav-links-wrapper">
          <NavLink className="nav-link" to="/dashboard" onClick={handleClick}>
            <p className="nav-txt">Home</p>
          </NavLink>
          {userData[0]?.role === "user" ? (
            <NavLink
              className="nav-link"
              to="/medications"
              onClick={handleClick}
            >
              <p className="nav-txt">Medications</p>
            </NavLink>
          ) : (
            <NavLink className="nav-link" to="/patients" onClick={handleClick}>
              <p className="nav-txt">Patients</p>
            </NavLink>
          )}
          {userData[0]?.role === "user" && (
            <NavLink
              className="nav-link"
              to="/caregivers"
              onClick={handleClick}
            >
              <p className="nav-txt">Caregivers</p>
            </NavLink>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
