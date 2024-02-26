import React, { useEffect, useState } from "react";
import "../Medications/Medications.scss";
import { supabase } from "../../supabasefiles/config";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";

function Patients({ user }) {
  const [refresh, setRefresh] = useRecoilState(refetch);
  const [patients, setPatients] = useState([]);

  const getPatients = async () => {
    const { data, error } = await supabase.rpc("get_caregiver_assignments", {
      userid: user?.id,
    });
    if (error) {
      console.log(error);
    } else {
      setPatients(data);
    }
  };

  useEffect(() => {
    getPatients();
  }, [user]);

  const handleDelete = async (id) => {};
  return (
    <div className="medications-wrapper">
      <div className="medications-txt-wrapper">
        <p className="medications-title">Patients</p>
        <p className="medications-sub">Here are your current patients.</p>
      </div>
      <div className="medications-table-container">
        <div className="table-header">
          <p className="table-heading">Name</p>
          <p className="table-heading">Email</p>

          <p className="table-heading last">Tools</p>
        </div>
        <div className="table-body">
          {patients.map((patient, i) => (
            <div key={i} className="table-row">
              <p className="table-cell">
                {patient.full_name === null ? patient.email : patient.full_name}
              </p>
              <p className="table-cell">{patient.email}</p>

              <p className="table-cell last">
                <button
                  className="edit-btn"
                  onClick={() => handleDelete(patient.patient_id)}
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

export default Patients;
