import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Medications from "./pages/Medications/Medications";
import WithoutNav from "./routerlayouts/WithoutNav";
import WithNav from "./routerlayouts/WithNav";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Login/Signup";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<WithoutNav />}>
            <Route path="/" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Route>
          <Route element={<WithNav />}>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/medications" element={<Medications />}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
