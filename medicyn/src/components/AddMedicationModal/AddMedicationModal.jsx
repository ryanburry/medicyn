import React, { useEffect, useState } from "react";
import "./AddMedicationModal.scss";
import { supabase } from "../../supabasefiles/config";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";

function AddMedicationModal({ show, setShow }) {
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

  const addMedication = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("medications").insert({
      user_id: user?.id,
      name: e.target[0].value,
      dosage: e.target[1].value,
      notes: e.target[2].value,
    });
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
      <div className="c-modal-container">
        <div className="cm-top">
          <div className="cm-t-txt">
            <p className="cm-title">Add a medication</p>
            <p className="cm-sub">
              Use the fields below to add a new medication.
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
          onSubmit={addMedication}
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
            />
          </div>
          <div className="cm-input">
            <label htmlFor="" className="cm-label">
              Dosage
            </label>
            <input type="text" className="cm-in" placeholder="200mg" required />
          </div>
          <div className="cm-input">
            <label htmlFor="" className="cm-label">
              Notes
            </label>
            <input
              type="text"
              className="cm-in"
              placeholder="Take with food.."
            />
          </div>
          <button type="submit" className="cm-submit-btn">
            Add Medication
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMedicationModal;
