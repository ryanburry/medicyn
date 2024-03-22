import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import AddMedicationModal from "../../components/AddMedicationModal/AddMedicationModal";
import "moment-timezone";
import { supabase } from "../../supabasefiles/config";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { refetch } from "../../store/atoms";

function CaregiverDashboard({ user, userData }) {
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useRecoilState(refetch);
  const [patients, setPatients] = useState();
  const [invites, setInvites] = useState();

  let navigate = useNavigate();

  const fetchPatients = async () => {
    const { data, error } = await supabase.rpc("get_caregiver_assignments", {
      userid: user?.id,
    });
    if (error) {
      console.log(error);
    } else {
      setPatients(data);
    }
  };

  const handleAccept = async (invite) => {
    // add user_id and caregiver_id to caregiver_assignments
    // if successful, update accepted field to true

    const { error } = await supabase.from("caregiver_assignments").upsert({
      caregiver_id: invite.caregiver_id,
      patient_id: invite.user_id,
    });
    if (error) {
      console.log(error);
    } else {
      const { error } = await supabase
        .from("invites")
        .delete()
        .eq("id", invite.id);
      if (error) {
        console.log(error);
      } else {
        let message = invite.caregiver_name + " is now your caregiver!";
        const { error } = await supabase
          .from("notifications")
          .insert({ user_id: invite.user_id, message: message });
        if (error) {
          console.log(error);
        }
        setRefresh(!refresh);
      }
    }
  };

  const handleDecline = async (invite) => {
    const { error } = await supabase
      .from("invites")
      .delete()
      .eq("id", invite.id);
    if (error) {
      console.log(error);
    }
  };

  const fetchInvites = async () => {
    const { data, error } = await supabase.rpc("get_invites", {
      _user_id: user?.id,
    });
    if (error) {
      console.log(error);
    } else {
      setInvites(data);
    }
  };

  console.log(invites);

  useEffect(() => {
    fetchPatients();
    fetchInvites();
  }, [user, refresh]);

  console.log(patients);
  return (
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
              <p className="panel-title">TBD</p>
              <p className="panel-content">TBD</p>
            </div>
            <div className="dash-panel med-panel">
              <div className="panel-left">
                <p className="panel-title">Patients</p>
                <p className="panel-content">{patients?.length}</p>
              </div>
              <div className="panel-right">
                <button
                  className="add-medication"
                  onClick={() => navigate("/patients")}
                >
                  See All
                </button>
              </div>
            </div>
          </div>
          <div className="schedule-wrapper">
            <div className="schedule-txt">
              <p className="schedule-title">My Patients</p>
              <button className="manage-sched-btn">Manage</button>
            </div>
            <div className="calendar-container">
              {patients?.map((patient, i) => (
                <div key={i} className="event-container">
                  <div className="title">
                    <p className="med-name">
                      {patient.full_name === null
                        ? patient.email
                        : patient.full_name}
                    </p>
                    <p className="med-dose">{patient.email}</p>
                  </div>
                  <button className="manage-sched-btn">Manage Schedule</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="dash-right">
          <div className="notifications-container">
            <p className="invites-title">Invites</p>
            {invites?.length !== 0 ? (
              <div className="invites-wrapper">
                {invites?.map((invite, i) => (
                  <div key={i} className="invite-container">
                    <p className="invite-txt">
                      {" "}
                      <span className="bold">{invite.user_name}</span> has
                      invited you to be their caregiver.
                    </p>
                    <div className="buttons-wrapper">
                      <button
                        className="accept-btn"
                        onClick={() => handleAccept(invite)}
                      >
                        Accept
                      </button>
                      <button
                        className="accept-btn decline"
                        onClick={() => handleDecline(invite)}
                      >
                        Decline
                      </button>
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
  );
}

export default CaregiverDashboard;
