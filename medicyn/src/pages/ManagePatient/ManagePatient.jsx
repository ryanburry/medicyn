import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Medications/Medications.scss";
import { supabase } from "../../supabasefiles/config";
import ManageMedicationModal from "../../components/EditMedicationModal/ManageMedicationModal";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";
import DoctorAddMedicationModal from "../../components/AddMedicationModal/DoctorAddMedicationModal";

function ManagePatient() {
  const { patient } = useParams();

  const [patientData, setPatientData] = useState([]);
  const [medications, setMedications] = useState([]);
  const [show, setShow] = useState(false);
  const [addShow, setAddShow] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const [refresh, setRefresh] = useRecoilState(refetch);
  const handleDelete = async (id) => {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) {
      console.log(error);
    } else {
      setRefresh(!refresh);
    }
  };
  const handleEdit = (medication) => {
    setSelectedMedication(medication);
    setShow(true);
  };

  const fetchPatientData = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", patient);

    if (!error) {
      setPatientData(data);
    } else {
      console.log(data);
    }
  };

  const fetchMedications = async () => {
    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", patient);
    if (!error) {
      setMedications(data);
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatientData();

    fetchMedications();
  }, [refresh]);
  return (
    <div className="medications-wrapper">
      {show && (
        <ManageMedicationModal
          medication={selectedMedication}
          show={show}
          setShow={setShow}
          patient={patient}
        />
      )}
      {addShow && (
        <DoctorAddMedicationModal
          medication={selectedMedication}
          addShow={addShow}
          setAddShow={setAddShow}
          patient={patient}
        />
      )}

      <div className="medications-txt-wrapper">
        <p className="medications-title">Ryan Burry</p>
        <p className="medications-sub">
          Here you can manage {patientData[0]?.full_name}'s medications.
        </p>
      </div>
      <div className="invite-caregiver-wrapper">
        <button className="invite-btn" onClick={() => setAddShow(!addShow)}>
          Add new medication
        </button>
      </div>
      <div className="medications-table-container">
        <div className="table-header">
          <p className="table-heading">Name</p>
          <p className="table-heading"># of Pills</p>
          <p className="table-heading">Notes</p>
          <p className="table-heading last">Tools</p>
        </div>
        <div className="table-body">
          {medications.map((medication, i) => (
            <div key={i} className="table-row">
              <p className="table-cell">{medication.name}</p>
              <p className="table-cell">{medication.dosage}</p>
              <p className="table-cell">{medication.notes}</p>
              <p className="table-cell last">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(medication)}
                >
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/fluency-systems-regular/48/0f0f0f/edit--v1.png"
                    alt="edit--v1"
                  />
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleDelete(medication.id)}
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

export default ManagePatient;
