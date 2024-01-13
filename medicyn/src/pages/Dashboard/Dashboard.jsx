import React from "react";
import "./Dashboard.scss";

function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      <div className="text-container">
        <h1 className="dashboard-title">Welcome back, Ryan!</h1>
        <p className="dashboard-sub">Thursday, January 18th 2024</p>
      </div>
      <div className="dashboard-container">
        <div className="dash-left">
          <div className="dash-left-top">
            <div className="dash-panel">
              <p className="panel-title">Upcoming Dose</p>
              <p className="panel-content">Today, 3pm</p>
            </div>
            <div className="dash-panel med-panel">
              <div className="panel-left">
                <p className="panel-title">Medications</p>
                <p className="panel-content">0</p>
              </div>
              <div className="panel-right">
                <button className="add-medication">Add</button>
              </div>
            </div>
          </div>
          <div className="schedule-wrapper">
            <div className="schedule-txt">
              <p className="schedule-title">My Schedule</p>
              <button className="manage-sched-btn">Manage</button>
            </div>
            <div className="calendar-container"></div>
          </div>
        </div>
        <div className="dash-right">
          <div className="notifications-container"></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
