import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import AddMedicationModal from "../../components/AddMedicationModal/AddMedicationModal";
import "moment-timezone";
import CaregiverDashboard from "./CaregiverDashboard";
import { supabase } from "../../supabasefiles/config";

function Dashboard({ user, medications }) {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState([]);
  const [notifications, setNotifications] = useState();

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user?.id);
    if (error) {
      console.log(error);
    } else {
      setNotifications(data);
    }
  };

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
    fetchNotifications();
  }, [user]);

  return userData[0]?.role === "user" ? (
    <div className="dashboard-wrapper">
      {show && <AddMedicationModal show={show} setShow={setShow} />}
      <div className="text-container">
        <h1 className="dashboard-title">
          Welcome back,{" "}
          {!userData[0]?.full_name
            ? userData[0]?.email
            : userData[0]?.full_name}
          !
        </h1>
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
            </div>
          </div>
        </div>
        <div className="dash-right">
          <div className="notifications-container">
            <p className="invites-title">Notifications</p>
            {notifications?.length !== 0 ? (
              <div className="invites-wrapper">
                {notifications?.map((notification, i) => (
                  <div key={i} className="invite-container">
                    <p className="invite-txt">{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="wrapper">
                <p className="no-invites">Nothing to see here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <CaregiverDashboard user={user} userData={userData} />
  );
}

export default Dashboard;
