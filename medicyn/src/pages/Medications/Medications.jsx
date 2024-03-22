import React, { useEffect, useState } from "react";
import "./Medications.scss";
import { supabase } from "../../supabasefiles/config";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";
import EditMedicationModal from "../../components/EditMedicationModal/EditMedicationModal";

function Medications({ user }) {
  const [refresh, setRefresh] = useRecoilState(refetch);
  const [show, setShow] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medications, setMedications] = useState([]);

  const handleEdit = (medication) => {
    setSelectedMedication(medication);
    setShow(true);
  };
  const fetchMedications = async () => {
    const { data, error } = await supabase
      .from("medications")
      .select(
        "id, dosage, name, notes, user_id, schedules(medication_id, day, dispense_time, dispensed)"
      )
      .eq("user_id", user?.id);
    if (!error) {
      setMedications(data);
    } else {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) {
      console.log(error);
    } else {
      setRefresh(!refresh);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [user, refresh]);
  return (
    <div className="medications-wrapper">
      {show && (
        <EditMedicationModal
          medication={selectedMedication}
          show={show}
          setShow={setShow}
        />
      )}
      <div className="medications-txt-wrapper">
        <p className="medications-title">Medications</p>
        <p className="medications-sub">Here are your current medications.</p>
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

export default Medications;
