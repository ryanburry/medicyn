import React, { useEffect, useState } from "react";
import "./EditMedicationModal.scss";
import { supabase } from "../../supabasefiles/config";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import moment from "moment-timezone";

function EditMedicationModal({ medication, show, setShow }) {
  const [user, setUser] = useState();
  const [refresh, setRefresh] = useRecoilState(refetch);
  const [selectedDays, setSelectedDays] = useState([]);

  const fetchDays = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("medication_id", medication.id);
    if (!error) {
      const newSelectedDays = data.map((medication) => {
        const medicationDate = new Date(medication.day);

        const offset = 240;

        const newDate = medicationDate.getTime() + offset * 60000;

        return new Date(newDate);
      });
      setSelectedDays(newSelectedDays);
      console.log(newSelectedDays);
    } else {
      console.log(error);
    }
  };

  const handleDateChange = (value) => {
    // value here is an array of selected dates
    setSelectedDays(value);
    //console.log(new Date(selectedDays[0]).toLocaleString("en-US")); //this is on to something
  };

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

    const { error: medicationError } = await supabase
      .from("medications")
      .update({
        name: e.target[0].value,
        dosage: e.target[1].value,
        notes: e.target[3].value,
      })
      .eq("id", medication.id);
    if (medicationError) {
      console.log(medicationError);
    }
    const { error: deleteError } = await supabase
      .from("schedules")
      .delete()
      .eq("medication_id", medication.id);
    if (deleteError) {
      console.log(deleteError);
    } else {
      selectedDays.map(async (day) => {
        const { error: insertError } = await supabase.from("schedules").insert({
          user_id: user?.id,
          medication_id: medication.id,
          dispensed: false,
          day: day.toLocaleString("en-US"),
        });
        if (insertError) {
          console.log(insertError);
        } else {
          setShow(!show);
          setRefresh(!refresh);
        }
      });
    }
  };

  useEffect(() => {
    fetchUser();
    fetchDays();
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
          <div className="form-row">
            <div className="cm-input m-name">
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
            <div className="cm-input  m-pills">
              <label htmlFor="" className="cm-label">
                # of Pills
              </label>
              <select defaultValue={medication.dosage} className="cm-drop">
                <option value="1" className="cm-option">
                  1
                </option>
                <option value="2" className="cm-option">
                  2
                </option>
                <option value="3" className="cm-option">
                  3
                </option>
                <option value="4" className="cm-option">
                  4
                </option>
                <option value="5" className="cm-option">
                  5
                </option>
              </select>
            </div>
          </div>
          <div className="cm-input">
            <label htmlFor="" className="cm-label">
              Schedule
            </label>
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              value={selectedDays}
              multiple
              onChange={handleDateChange}
              plugins={[
                <TimePicker
                  position="right"
                  sStep={0}
                  locale="en" // Set locale to English
                />,
                <DatePanel markFocused />,
              ]}
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
