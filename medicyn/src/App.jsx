import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Medications from "./pages/Medications/Medications";
import WithoutNav from "./routerlayouts/WithoutNav";
import WithNav from "./routerlayouts/WithNav";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Login/Signup";
import { useEffect, useState } from "react";
import { supabase } from "./supabasefiles/config";
import { useRecoilState } from "recoil";
import { refetch } from "./store/atoms";
import Patients from "./pages/Patients/Patients";
import Caregivers from "./pages/Caregivers/Caregivers";
import ManagePatient from "./pages/ManagePatient/ManagePatient";

function App() {
  const [user, setUser] = useState();
  const [medications, setMedications] = useState([]);
  const [refresh, setRefresh] = useRecoilState(refetch);

  const [timeoutFired, setTimeoutFired] = useState(false);

  const [scheduledPills, setScheduledPills] = useState([]);

  setTimeout(() => {
    if (scheduledPills?.length > 0) {
      checkDispenseTime(scheduledPills);
    }
  }, 10000);

  const isPastDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const currentDateTime = new Date();

    dateTime.setHours(dateTime.getHours() + 4);

    // Extract date and time components separately
    const currentDate = new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth(),
      currentDateTime.getDate(),
      currentDateTime.getHours(),
      currentDateTime.getMinutes(),
      currentDateTime.getSeconds()
    );
    const currentTime =
      currentDateTime.getHours() * 3600 +
      currentDateTime.getMinutes() * 60 +
      currentDateTime.getSeconds();

    const targetDate = new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
      dateTime.getHours(),
      dateTime.getMinutes(),
      dateTime.getSeconds()
    );
    const targetTime =
      dateTime.getHours() * 3600 +
      dateTime.getMinutes() * 60 +
      dateTime.getSeconds();

    return (
      currentDate > dateTime ||
      (currentDate.getTime() === dateTime.getTime() && currentTime >= dateTime)
    );
  };

  const checkDispenseTime = async (medications) => {
    if (!timeoutFired) {
      medications.forEach(async (medication) => {
        if (medication.dispensed === true) {
          return;
        }

        if (isPastDateTime(medication.day)) {
          setTimeoutFired(true);
          // Trigger dispensing function for this medication
          console.log(
            `Dispensing ${medication.medications.name} at ${medication.day}`
          );
          const { error } = await supabase
            .from("schedules")
            .update({ dispensed: true })
            .eq("medication_id", medication.medications.id);
          if (error) {
            console.log(error);
          } else {
            if (!timeoutFired) {
              const { error } = await supabase.from("notifications").insert({
                user_id: user?.id,
                message:
                  medication.medications.name +
                  " has been dispensed, kindly mark it as taken once consumed.",
              });
              if (error) {
                console.log(error);
              } else {
                setRefresh(!refresh);
                setTimeoutFired(false);
              }
            }
          }
        }
      });
    }
  };

  const fetchScheduledPills = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select(
        "id, day, dispense_time, dispensed, medications(id, dosage, name, notes)"
      )
      .eq("user_id", user?.id);
    if (!error) {
      setScheduledPills(data);
    } else {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
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

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchMedications();
    fetchScheduledPills();
  }, [user, refresh]);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<WithoutNav />}>
            <Route path="/" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Route>
          <Route element={<WithNav />}>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  user={user}
                  medications={medications}
                  scheduledPills={scheduledPills}
                />
              }
            ></Route>
            <Route
              path="/medications"
              element={<Medications user={user} medications={medications} />}
            ></Route>
            <Route path="/patients" element={<Patients user={user} />}></Route>
            <Route
              path="/caregivers"
              element={<Caregivers user={user} />}
            ></Route>
            <Route path="/manage/:patient" element={<ManagePatient />}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
