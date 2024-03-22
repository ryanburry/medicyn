import React, { useEffect, useState } from "react";
import "./AddMedicationModal.scss";
import { supabase } from "../../supabasefiles/config";
import { refetch } from "../../store/atoms";
import { useRecoilState } from "recoil";

import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import moment from "moment-timezone";

function DoctorAddMedicationModal({ addShow, setAddShow, patient }) {
  const [user, setUser] = useState();
  const [refresh, setRefresh] = useRecoilState(refetch);

  const [time, setTime] = useState("8:00");
  const [selectedDays, setSelectedDays] = useState([]);
  const handleDateChange = (value) => {
    // value here is an array of selected dates
    setSelectedDays(value);
    //console.log(new Date(selectedDays[0]).toLocaleString("en-US")); //this is on to something
  };
  /*
  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };*/

  const handleChange = async (event) => {
    setTime(event.target.value);
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
      setAddShow(!addShow);
    }
  };

  const addMedication = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("medications")
      .insert({
        user_id: patient,
        name: e.target[0].value,
        dosage: e.target[1].value,
        notes: e.target[3].value,
      })
      .single()
      .select("*");

    if (!error) {
      setAddShow(!addShow);
      setRefresh(!refresh);

      if (data && selectedDays.length !== 0) {
        const newMedicationId = data.id;

        selectedDays.forEach(async (day) => {
          const { error } = await supabase.from("schedules").insert({
            user_id: patient,
            medication_id: newMedicationId,
            day: day.toLocaleString("en-US"),
          });
          if (error) {
            console.log(error);
          }
        });
      }
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
          <button className="cm-close" onClick={() => setAddShow(!addShow)}>
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
              />
            </div>
            <div className="cm-input  m-pills">
              <label htmlFor="" className="cm-label">
                # of Pills
              </label>
              <select className="cm-drop">
                <option className="cm-option">1</option>
                <option className="cm-option">2</option>
                <option className="cm-option">3</option>
                <option className="cm-option">4</option>
                <option className="cm-option">5</option>
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
            {/** 
            <label className="schedule-label time">
              Time of Day:
              <input
                type="time"
                value={time}
                onChange={(e) => handleChange(e)}
              />
            </label>
            <label className="schedule-label">
              Days of the Week:
              <div>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, key) => (
                    <label className="in" key={key}>
                      <input
                        className="schedule-label"
                        type="checkbox"
                        value={key}
                        checked={selectedDays.includes(key)}
                        onChange={() => handleDayToggle(key)}
                      />
                      &nbsp;
                      {day}
                    </label>
                  )
                )}
              </div>
              
            </label>*/}
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

export default DoctorAddMedicationModal;
