import React from "react";
import "./Medications.scss";
import { supabase } from "../../supabasefiles/config";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";

function Medications({ user, medications }) {
  const [refresh, setRefresh] = useRecoilState(refetch);

  const handleDelete = async (name) => {
    const { error } = await supabase
      .from("medications")
      .delete()
      .match({ user_id: user?.id, name: name });
    if (error) {
      console.log(error);
    } else {
      setRefresh(!refresh);
    }
  };
  return (
    <div className="medications-wrapper">
      <div className="medications-txt-wrapper">
        <p className="medications-title">Medications</p>
        <p className="medications-sub">Here are your current medications.</p>
      </div>
      <div className="medications-table-container">
        <table className="medications-table">
          <thead className="medications-table-head">
            <tr className="medications-table-row">
              <th className="med-header">Name</th>
              <th className="med-header">Dosage</th>
              <th className="med-header">Notes</th>
              <th className="med-header tools">Tools</th>
            </tr>
          </thead>
          <tbody>
            {medications?.map((medication, key) => (
              <div className="medications-table-row" key={key}>
                <td>{medication.name}</td>
                <td>{medication.dosage}</td>
                <td>{medication.notes}</td>
                <div className="space"></div>
                <button className="edit-btn">Edit</button>
                <button
                  className="edit-btn"
                  onClick={() => handleDelete(medication.name)}
                >
                  Delete
                </button>
              </div>
            ))}

            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Medications;
