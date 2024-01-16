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

function App() {
  const [user, setUser] = useState();
  const [medications, setMedications] = useState([]);
  const [refresh, setRefresh] = useRecoilState(refetch);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchMedications = async () => {
    const { data, error } = await supabase
      .from("medications")
      .select("*")
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
              element={<Dashboard user={user} medications={medications} />}
            ></Route>
            <Route
              path="/medications"
              element={<Medications user={user} medications={medications} />}
            ></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
