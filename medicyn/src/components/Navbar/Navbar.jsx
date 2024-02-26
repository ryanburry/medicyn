import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import logo from "../../assets/logo.svg";
import { supabase } from "../../supabasefiles/config";

function Navbar() {
  const [user, setUser] = useState();

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="nav-wrapper">
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

        <NavLink className="nav-link" to="/schedule">
          <p className="nav-txt">Schedule</p>
        </NavLink>
      </div>
      <div className="space"></div>
      <button className="logout-btn" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}

export default Navbar;
