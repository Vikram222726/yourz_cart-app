import React, { useState, useEffect } from "react";
import "./Login.css";
import signupimage from "../images/signup.jpg";
import { Link, useHistory } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
} from "../components/validate_user_details";
import axios from "axios";

const Login = ({ setItemsInCart, toggleLogBtn, adminUser }) => {
  const [loginmail, setLoginmail] = useState("");
  const [loginpassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const verifyToken = JSON.parse(localStorage.getItem("Auth_Token"));
    if (verifyToken) {
      history.replace("/");
      return;
    }
  }, []);

  const handleEmail = (e) => {
    setLoginError("");
    setLoginmail(e.target.value);
  };

  const handlePassword = (e) => {
    setLoginError("");
    setLoginPassword(e.target.value);
  };

  const extractPayloadFromToken = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  const validateLogin = async () => {
    try {
      const isValidLoginMail = validateEmail(loginmail);
      if (isValidLoginMail !== "valid") {
        setLoginError("Invalid Email or Password!");
        return;
      }

      const isValidLoginPassword = validatePassword(loginpassword);
      if (isValidLoginPassword !== "valid") {
        setLoginError("Invalid Email or Password!");
        return;
      }
      setLoginError("");

      const result = await axios.post(
        "https://youzcart.herokuapp.com/api/login",
        {
          email: loginmail,
          password: loginpassword,
        }
      );
      console.log(result);

      const token = result.data["token"];

      if (token) {
        let payload = extractPayloadFromToken(token);
        const cartMail = payload["email"];
        if (payload["isAdmin"]) {
          adminUser(true);
          localStorage.setItem("isAdmin", true);
        }
        const getCart = await axios.post(
          "https://youzcart.herokuapp.com/api/cart_item",
          { email: cartMail }
        );
        const cartItems = getCart.data["cartItems"];
        localStorage.setItem("email", JSON.stringify(cartMail));
        localStorage.setItem("storedItems", JSON.stringify(cartItems));
        localStorage.setItem("Auth_Token", JSON.stringify(token));
        setItemsInCart();
        toggleLogBtn();
      }

      history.replace("/");
    } catch (ex) {
      console.log(ex);
      setLoginError(
        ex.response !== undefined
          ? ex.response.data
          : "Invalid Login Credentials!"
      );
    }
  };

  return (
    <div className="login">
      <div className="login__wrapper">
        <div className="login__details">
          <div className="login__header">Sign in</div>
          <div className="login__error">{loginError}</div>
          <div className="login__fields">
            <div className="login__user__field">
              <span className="login__user__icon">
                <i className="fas fa-envelope" />
              </span>
              <span className="login__user__icon">
                <input
                  type="email"
                  id="email"
                  className="login__text__field"
                  placeholder="Email"
                  onChange={handleEmail}
                />
              </span>
            </div>
            <div className="login__user__field">
              <span className="login__user__icon">
                <i className="fas fa-key" />
              </span>
              <span className="login__user__icon">
                <input
                  type="password"
                  id="password"
                  className="login__text__field"
                  placeholder="Password"
                  onChange={handlePassword}
                />
              </span>
            </div>
            <div className="login__btn" onClick={validateLogin}>
              Sign In
            </div>
          </div>
          <div className="login__to__signup">
            <Link to="/register">Create an account</Link>
          </div>
        </div>
        <div className="login__image">
          <img src={signupimage} alt="login User" />
        </div>
      </div>
    </div>
  );
};

export default Login;
