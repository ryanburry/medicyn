import React from "react";
import "./Login.scss";
import logo from "../../assets/logo.svg";
import showcase from "../../assets/showcase.svg";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabasefiles/config";

function Login() {
  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("user_email").value;
    const password = document.getElementById("user_password").value; // for now there is no restirctions on password , will implement in the future

    let { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (!error) {
      navigate("/dashboard");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-top">
          <div className="logo-container">
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="login-body-wrapper">
          <div className="login-body">
            <div className="heading-txt">
              <h1 className="login-heading">Log in</h1>
              <p className="login-sub">
                Welcome back! Enter your email and password to continue.
              </p>
            </div>
            <form
              className="login-form"
              action="submit"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="input-wrapper">
                <label htmlFor="" className="input-lbl">
                  Email
                </label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="Enter email here..."
                  id="user_email"
                />
              </div>
              <div className="input-wrapper pass-wrapper">
                <label htmlFor="" className="input-lbl">
                  Password
                </label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="Enter password here..."
                  id="user_password"
                />
              </div>
              <p className="forgot-pass">
                Forgot your password?{" "}
                <span
                  className="log-in-switch"
                  onClick={() => navigate("/recover")}
                >
                  Recover
                </span>{" "}
                here.
              </p>
              <button className="log-in-button" type="submit">
                Log in
              </button>
            </form>
            <p className="bottom-txt">
              Don't have an account?{" "}
              <span
                className="log-in-switch"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>{" "}
              instead.
            </p>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="showcase-wrapper">
          <img className="showcase-img" src={showcase} alt="" />
        </div>

        <p className="right-txt-title">Revolutionize your medication routine</p>
        <p className="right-txt">
          Effortlessly manage, schedule, and track your dosages, ensuring a
          healthier and more organized life.
        </p>
      </div>
    </div>
  );
}

export default Login;
