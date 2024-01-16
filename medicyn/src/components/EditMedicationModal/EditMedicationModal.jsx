import React, { useEffect, useState } from "react";
import "./EditMedicationModal.scss";
import { supabase } from "../../supabasefiles/config";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";

function EditMedicationModal({ medication, show, setShow }) {
  const [user, setUser] = useState();
  const [refresh, setRefresh] = useRecoilState(refetch);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleClick = (e) => {
    if (e.target.classList.contains("c-modal-wrapper")) {
      e.stopPropagation();
      setShow(!show);
    }
  };

  const editMedication = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("medications")
      .update({
        name: e.target[0].value,
        dosage: e.target[1].value,
        notes: e.target[2].value,
      })
      .eq("id", medication.id);
    if (!error) {
      setShow(!show);
      setRefresh(!refresh);
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="c-modal-wrapper" onClick={handleClick}>
      <div className="m-modal-container">
        <div className="cm-top">
          <div className="cm-t-txt">
            <p className="cm-title">Edit medication info</p>
            <p className="cm-sub">
              Use the fields below to edit the medication.
            </p>
          </div>
          <button className="cm-close" onClick={() => setShow(!show)}>
            <img
              width="16"
              height="16"
              src="https://img.icons8.com/windows/32/b3b3b3/delete-sign.png"
              alt="delete-sign"
            />
          </button>
        </div>
        <form
          action="submit"
          className="add-course-form"
          onSubmit={editMedication}
        >
          <div className="cm-input">
            <label htmlFor="" className="cm-label">
              Name
            </label>
            <input
              type="text"
              className="cm-in"
              placeholder="Advil.."
              required
              defaultValue={medication.name}
            />
          </div>
          <div className="cm-input">
            <label htmlFor="" className="cm-label">
              Dosage
            </label>
            <input
              type="text"
              className="cm-in"
              placeholder="200mg"
              required
              defaultValue={medication.dosage}
            />
          </div>
          <div className="cm-input">
            <label htmlFor="" className="cm-label">
              Notes
            </label>
            <input
              type="text"
              className="cm-in"
              placeholder="Take with food.."
              defaultValue={medication.notes}
            />
          </div>
          <button type="submit" className="cm-submit-btn">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditMedicationModal;
