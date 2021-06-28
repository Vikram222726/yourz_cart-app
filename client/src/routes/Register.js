import React, { useState } from "react";
import "./Register.css";
import signupimage from "../images/signup.jpg";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  validateUserName,
  validateEmail,
  validatePassword,
} from "../components/validate_user_details";

const Register = () => {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUsername = (e) => {
    setError("");
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setError("");
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setError("");
    setPassword(e.target.value);
  };

  const RegisterUser = async () => {
    try {
      const isValidUsername = validateUserName(username);
      if (isValidUsername !== "valid") {
        setError(isValidUsername);
        return;
      }

      const isValidEmail = validateEmail(email);
      if (isValidEmail !== "valid") {
        setError(isValidEmail);
        return;
      }

      const isValidPassword = validatePassword(password);
      if (isValidPassword !== "valid") {
        setError(isValidPassword);
        return;
      }

      const request = await axios.post(
        "https://youzcart.herokuapp.com/api/users",
        {
          username: username,
          email: email,
          password: password,
        }
      );

      alert("You are Registered Successfully!");
      history.replace("/login");
    } catch (ex) {
      console.log(ex.response);
      setError(
        ex.response !== undefined
          ? ex.response.data
          : "Invalid Sign up Credentails!"
      );
    }
  };

  return (
    <div className="register">
      <div className="register__wrapper">
        <div className="register__details">
          <div className="register__header">Sign up</div>
          <div className="register__error">{error}</div>
          <div className="register__fields">
            <div className="register__user__field">
              <span className="register__user__icon">
                <i className="fas fa-user" />
              </span>
              <span className="register__user__icon">
                <input
                  type="text"
                  id="username"
                  className="register__text__field"
                  onChange={handleUsername}
                  placeholder="Username"
                />
              </span>
            </div>
            <div className="register__user__field">
              <span className="register__user__icon">
                <i className="fas fa-envelope" />
              </span>
              <span className="register__user__icon">
                <input
                  type="email"
                  id="email"
                  className="register__text__field"
                  placeholder="Email"
                  onChange={handleEmail}
                />
              </span>
            </div>
            <div className="register__user__field">
              <span className="register__user__icon">
                <i className="fas fa-key" />
              </span>
              <span className="register__user__icon">
                <input
                  type="password"
                  id="password"
                  className="register__text__field"
                  placeholder="Password"
                  onChange={handlePassword}
                />
              </span>
            </div>
            <div className="register__btn" onClick={RegisterUser}>
              Sign Up
            </div>
          </div>
          <div className="register__to__signup">
            <Link to="/login">
              Already have an account
              <br />
              Click here to Login
            </Link>
          </div>
        </div>
        <div className="register__image">
          <img src={signupimage} alt="Register User" />
        </div>
      </div>
    </div>
  );
};

export default Register;
