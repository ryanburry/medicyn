import React, { useEffect, useState } from "react";
import "../AddMedicationModal/AddMedicationModal.scss";
import { supabase } from "../../supabasefiles/config";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";

function InviteCaregiverModal({ show, setShow }) {
  const [user, setUser] = useState();
  const [refresh, setRefresh] = useRecoilState(refetch);
  const [caregivers, setCaregivers] = useState();

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchCaregivers = async () => {
    const { data, error } = await supabase
      .from("caregivers")
      .select("id, user_id, profiles(id, full_name, email)");
    if (error) {
      console.log(error);
    } else {
      setCaregivers(data);
      console.log(caregivers);
    }
  };

  const handleClick = (e) => {
    if (e.target.classList.contains("c-modal-wrapper")) {
      e.stopPropagation();
      setShow(!show);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("invites").insert({
      user_id: user?.id,
      caregiver_id: e.target[0].value,
    });
    if (!error) {
      setShow(!show);
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCaregivers();
  }, []);

  return (
    <div className="c-modal-wrapper" onClick={handleClick}>
      <div className="c-modal-container">
        <div className="cm-top">
          <div className="cm-t-txt">
            <p className="cm-title">Invite a caregiver</p>
            <p className="cm-sub">
              Use the fields below to add a caregiver. This user will be able to
              schedule medications on your behalf.
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
          onSubmit={handleInvite}
        >
          <div className="form-row">
            <div className="cm-input">
              <label htmlFor="caregiver" className="cm-label">
                Caregiver
              </label>
              <select name="caregiver" id="">
                {caregivers?.map((caregiver, i) => (
                  <option key={i} value={caregiver.user_id}>
                    {caregiver.profiles.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="cm-submit-btn">
            Invite Caregiver
          </button>
        </form>
      </div>
    </div>
  );
}

export default InviteCaregiverModal;
