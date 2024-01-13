import React, { useState, useEffect } from "react";
import "./Login.scss";
import logo from "../../assets/logo.svg";
import showcase from "../../assets/showcase.svg";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabasefiles/config";

function SignUp() {
  let navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [validPasswordMatch, setValidPasswordMatch] = useState(false);
  const [disableSignUp, setDisableSignUp] = useState(true);

  const lengthSymbolClass =
    password.length >= 6 ? "symbol_valid" : "symbol_invalid";

  const lengthSymbolClass_text =
    password.length >= 6 ? "text_valid" : "text_invalid";

  const containsSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const specialSymbolClass = containsSpecialChar
    ? "symbol_valid"
    : "symbol_invalid";

  const specialSymbolClass_text = containsSpecialChar
    ? "text_valid"
    : "text_invalid";

  const containsUppercase = /[A-Z]/.test(password);
  const uppercaseSymbolClass = containsUppercase
    ? "symbol_valid"
    : "symbol_invalid";

  const uppercaseSymbolClass_text = containsUppercase
    ? "text_valid"
    : "text_invalid";

  useEffect(() => {
    if (containsUppercase && containsSpecialChar && password.length >= 6) {
      setValidPassword(true);
    } else {
      setDisableSignUp(true);
    }
  }, [containsUppercase, containsSpecialChar, password]);

  async function handleSubmit(e) {
    e.preventDefault();

    const email = document.getElementById("user_email_signUp").value;
    const password_1 = document.getElementById("user_password_1").value;

    let { data, error } = await supabase.auth.signUp({
      email: email,
      password: password_1,
    });

    if (!error) {
      navigate("/dashboard");
    }
  }

  function handlePasswordInput(event) {
    setValidPassword(false);
    setValidPasswordMatch(false);
    setDisableSignUp(true);
    setPassword(event.target.value);

    if (validPassword) {
      if (event.target.value === password2) {
        setValidPasswordMatch(true);
        setDisableSignUp(false);
      }
    }
  }

  function handlePasswordInputMatch(event) {
    setValidPasswordMatch(false);
    setDisableSignUp(true);
    setPassword2(event.target.value);
    if (validPassword) {
      if (password === event.target.value) {
        setValidPasswordMatch(true);
        setDisableSignUp(false);
      }
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
              <h1 className="login-heading">Sign up</h1>
              <p className="login-sub">
                Welcome to Medicyn, use the form below to sign up for an
                account.
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
                  id="user_email_signUp"
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
                  id="user_password_1"
                  onInput={(e) => handlePasswordInput(e)}
                />
              </div>
              <div className="restrictions-wrapper">
                <div className="signup-password-restrictions-container">
                  <div className={lengthSymbolClass}></div>
                  <p className={lengthSymbolClass_text}>6 characters</p>
                </div>
                <div className="signup-password-restrictions-container">
                  <div className={specialSymbolClass}></div>
                  <p className={specialSymbolClass_text}>Special character</p>
                </div>
                <div className="signup-password-restrictions-container">
                  <div className={uppercaseSymbolClass}></div>
                  <p className={uppercaseSymbolClass_text}>Uppercase letter</p>
                </div>
              </div>
              <div className="input-wrapper pass-wrapper">
                <label htmlFor="" className="input-lbl">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="Enter password here..."
                  id="user_password_2"
                  onInput={(e) => handlePasswordInputMatch(e)}
                />
              </div>
              <button
                className="log-in-button"
                type="submit"
                disabled={disableSignUp}
              >
                Sign up
              </button>
            </form>
            <p className="bottom-txt">
              Already have an account?{" "}
              <span className="log-in-switch" onClick={() => navigate("/")}>
                Log in
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

export default SignUp;
