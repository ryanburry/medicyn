import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import AddMedicationModal from "../../components/AddMedicationModal/AddMedicationModal";
import "moment-timezone";
import CaregiverDashboard from "./CaregiverDashboard";
import { supabase } from "../../supabasefiles/config";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { refetch } from "../../store/atoms";

function Dashboard({ user, medications, scheduledPills }) {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState([]);
  const [notifications, setNotifications] = useState();
  const [refresh, setRefresh] = useRecoilState(refetch);

  const clearNotifications = async () => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", user?.id);
    if (error) {
      console.log(error);
    } else {
      setRefresh(!refresh);
    }
  };

  const handleComplete = async (medication) => {
    console.log(medication);
    const { error } = await supabase
      .from("schedules")
      .delete()
      .eq("id", medication.id);
    if (error) {
      console.log(error);
    } else {
      setRefresh(!refresh);
    }
  };

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

  function formatDispenseDateTime(scheduledPill) {
    const today = new Date().getDay();
    const tomorrow = (today + 1) % 7;

    if (scheduledPill.day === today) {
      return "Today";
    } else if (scheduledPill.day === tomorrow) {
      return "Tomorrow";
    } else {
      return moment(scheduledPill.day).tz("UTC").format("dddd, h:mm a");
    }
  }

  useEffect(() => {
    fetchUserData();
    fetchNotifications();
  }, [user, refresh]);

  const currentDate = moment().format("dddd, MMMM Do YYYY, h:mm a");

  const sortedPills = scheduledPills.sort((a, b) => {
    const dateA = new Date(a.day);
    const dateB = new Date(b.day);
    return dateA - dateB; // Sort in descending order (most recent date first)
  });

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
        <p className="dashboard-sub">{currentDate}</p>
      </div>
      <div className="dashboard-container">
        <div className="dash-left">
          <div className="dash-left-top">
            <div className="dash-panel">
              <p className="panel-title">Upcoming Dose</p>
              {scheduledPills?.length > 0 ? (
                <p className="panel-content">
                  {formatDispenseDateTime(scheduledPills[0])}
                </p>
              ) : (
                <p className="panel-content">No upcoming doses!</p>
              )}
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
              <Link to="/medications" className="manage-sched-btn">
                Manage
              </Link>
            </div>
            <div className="calendar-container">
              {sortedPills?.map((medication, i) => {
                return (
                  <div key={i} className="event-container">
                    <div className="left">
                      <div className="pill-icon">
                        <img
                          width="24"
                          height="24"
                          src="https://img.icons8.com/material-rounded/48/000000/pill.png"
                          alt="pill"
                        />
                      </div>

                      <div className="title">
                        <p className="med-name">
                          {medication.medications.name}
                        </p>
                        {medication.dispensed === false ? (
                          <p className="med-dose">
                            {medication.medications.dosage} pill(s) -{" "}
                            {medication.medications.notes === ""
                              ? "No notes found"
                              : `${medication.medications.notes}`}
                          </p>
                        ) : (
                          <p className="med-dose">
                            Dispensed on{" "}
                            {moment(medication.day)
                              .tz("UTC")
                              .format("dddd, MMM Do h:mm a")}
                          </p>
                        )}
                      </div>
                    </div>
                    {medication.dispensed === false ? (
                      <div className="med-date">
                        <p className="med-time">
                          {moment(medication.day)
                            .tz("UTC")
                            .format("dddd, MMM Do h:mm a")}
                        </p>
                      </div>
                    ) : (
                      <div className="med-date">
                        <button
                          className="complete-btn"
                          onClick={() => handleComplete(medication)}
                        >
                          Mark as taken
                        </button>
                        <button
                          className="complete-btn mobile-complete-btn"
                          onClick={() => handleComplete(medication)}
                        >
                          <img
                            width="16"
                            height="16"
                            src="https://img.icons8.com/ios-glyphs/30/ffffff/checked--v1.png"
                            alt="checked--v1"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="dash-right">
          <div className="notifications-container">
            <div className="notifications-title-wrapper">
              <p className="invites-title">Notifications</p>
              <button className="clear-btn" onClick={clearNotifications}>
                Clear All
              </button>
            </div>
            {notifications?.length !== 0 ? (
              <div className="invites-wrapper">
                {notifications?.map((notification, i) => (
                  <div key={i} className="invite-container">
                    <div className="invite-icon">
                      <img
                        width="24"
                        height="24"
                        src="https://img.icons8.com/material-rounded/48/ffffff/bell--v1.png"
                        alt="bell--v1"
                      />
                    </div>
                    <div className="invite-txt-wrapper">
                      <p className="invite-title">Dispensing Alert</p>
                      <p className="invite-txt">{notification.message}</p>
                    </div>
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
