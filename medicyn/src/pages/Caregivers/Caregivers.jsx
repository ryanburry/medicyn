import React, { useEffect, useState } from "react";
import "../Medications/Medications.scss";
import { supabase } from "../../supabasefiles/config";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";
import InviteCaregiverModal from "../../components/InviteCaregiverModal/InviteCaregiverModal";

function Caregivers({ user }) {
  const [refresh, setRefresh] = useRecoilState(refetch);
  const [show, setShow] = useState(false);
  const [caregivers, setCaregivers] = useState([]);

  const getCaregivers = async () => {
    const { data, error } = await supabase.rpc("get_caregivers", {
      _user_id: user?.id,
    });
    if (error) {
      console.log(error);
    } else {
      setCaregivers(data);
    }
  };

  const handleDelete = async (caregiver_id) => {
    const { error } = await supabase
      .from("caregiver_assignments")
      .delete()
      .match({ caregiver_id: caregiver_id, patient_id: user.id });
    if (error) {
      console.log(error);
    } else {
      setRefresh(!refresh);
    }
  };

  useEffect(() => {
    getCaregivers();
  }, [user, refresh]);

  return (
    <div className="medications-wrapper">
      {show && <InviteCaregiverModal show={show} setShow={setShow} />}
      <div className="medications-txt-wrapper">
        <p className="medications-title">Caregivers</p>
        <p className="medications-sub">Here are your current caregivers.</p>
      </div>
      <div className="invite-caregiver-wrapper">
        <button className="invite-btn" onClick={() => setShow(!show)}>
          Invite Caregiver
        </button>
      </div>
      <div className="medications-table-container caregivers">
        <div className="table-header">
          <p className="table-heading">Name</p>
          <p className="table-heading">Email</p>

          <p className="table-heading last">Tools</p>
        </div>
        <div className="table-body">
          {caregivers.map((caregiver, i) => (
            <div key={i} className="table-row">
              <p className="table-cell">
                {caregiver.name === null ? caregiver.email : caregiver.name}
              </p>
              <p className="table-cell">{caregiver.email}</p>

              <p className="table-cell last">
                <button
                  className="edit-btn"
                  onClick={() => handleDelete(caregiver.id)}
                >
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/material-rounded/24/000000/delete-forever.png"
                    alt="delete-forever"
                  />
                </button>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Caregivers;
