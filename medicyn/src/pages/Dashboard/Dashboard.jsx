import React, { useState } from "react";
import "./Dashboard.scss";
import AddMedicationModal from "../../components/AddMedicationModal/AddMedicationModal";
import "moment-timezone";

function Dashboard({ user, medications }) {
  const [show, setShow] = useState(false);
  console.log(user);
  return (
    <div className="dashboard-wrapper">
      {show && <AddMedicationModal show={show} setShow={setShow} />}
      <div className="text-container">
        <h1 className="dashboard-title">Welcome back, {user?.email}!</h1>
        <p className="dashboard-sub">Thursday, January 18th 2024</p>
      </div>
      <div className="dashboard-container">
        <div className="dash-left">
          <div className="dash-left-top">
            <div className="dash-panel">
              <p className="panel-title">Upcoming Dose</p>
              <p className="panel-content">Advil - 34 Minutes</p>
            </div>
            <div className="dash-panel med-panel">
              <div className="panel-left">
                <p className="panel-title">Medications</p>
                <p className="panel-content">{medications?.length}</p>
              </div>
              <div className="panel-right">
                <button
                  className="add-medication"
                  onClick={() => setShow(!show)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="schedule-wrapper">
            <div className="schedule-txt">
              <p className="schedule-title">My Schedule</p>
              <button className="manage-sched-btn">Manage</button>
            </div>
            <div className="calendar-container">
              {medications?.map((medication, i) => {
                if (medication.time !== null) {
                  return (
                    <div key={i} className="event-container">
                      <div className="title">
                        <p className="med-name">{medication.name}</p>
                        <p className="med-dose">{medication.dosage} pill(s)</p>
                      </div>
                      <p className="med-time">in 34 Minutes</p>
                    </div>
                  );
                } else {
                  return null; // Or you can return any other placeholder content if needed
                }
              })}
              <div className="event-container">
                <div className="title">
                  <p className="med-name">Tylonel</p>
                  <p className="med-dose">2 pill(s)</p>
                </div>
                <p className="med-time">in 4 hours</p>
              </div>
            </div>
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
