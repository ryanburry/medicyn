import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import "./WithNav.scss";

const WithNav = () => {
  return (
    <>
      <div className="main-split">
        <Navbar />
        <div className="outlet-split">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default WithNav;
