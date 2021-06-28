import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const NavBar = ({
  flipBackDrop,
  filterProducts,
  itemInCart,
  logBtn,
  toggleLogBtn,
  setItemsInCart,
  adminUser,
  admin,
}) => {
  const [adminPerson, setAdminPerson] = useState(false);

  useEffect(() => {
    setItemsInCart();
    toggleLogBtn();
    const user = localStorage.getItem("isAdmin");
    if (user !== null) {
      setAdminPerson(true);
    } else {
      setAdminPerson(false);
    }
  }, [admin, adminUser]);

  const history = useHistory();
  const extractPayloadFromToken = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  const signOutUser = async () => {
    try {
      let token = JSON.parse(localStorage.getItem("Auth_Token"));

      const userMail = extractPayloadFromToken(token)["email"];

      let cartItems = JSON.parse(localStorage.getItem("storedItems"));

      const request = await axios.put(
        "https://youzcart.herokuapp.com/api/cart_item",
        {
          email: userMail,
          cartItems: cartItems,
        }
      );
      localStorage.removeItem("Auth_Token");
      localStorage.removeItem("storedItems");
      localStorage.removeItem("email");

      adminUser(false);
      setItemsInCart();
      toggleLogBtn();
    } catch (ex) {
      console.log(ex);
    }
  };

  const redirectAdminPage = () => {
    history.push("/admin");
  };

  const goToHome = () => {
    history.replace("/");
    window.location.reload();
  };

  const goToCart = () => {
    const token = JSON.parse(localStorage.getItem("Auth_Token"));
    if (!token) {
      history.push("/login");
      return;
    }
    history.push("/cart");
  };

  return (
    <div className="navbar">
      <div className="navbar__logo">
        <h2 className="navbar__logo__firstname">YOURZ</h2>
        <p className="navbar__logo__secondname">Cart</p>
      </div>
      <div className="navbar__home__logo" onClick={goToHome}>
        <i className="fas fa-home fa-2x" />
        <div className="navbar__home__text">Home</div>
      </div>
      <div className="navbar__options">
        <ul>
          <Link to="/">
            <li
              className="navbar__options__agegrp"
              onClick={() => filterProducts("men")}
            >
              Male
            </li>
          </Link>
          <Link to="/">
            <li
              className="navbar__options__agegrp"
              onClick={() => filterProducts("women")}
            >
              Female
            </li>
          </Link>
          <Link to="/">
            <li
              className="navbar__options__agegrp"
              onClick={() => filterProducts("kids")}
            >
              Kids
            </li>
          </Link>
        </ul>
      </div>
      <div className="navbar__register">
        {logBtn === false ? (
          <Link to="/register">
            <div className="navbar__register__signup">SIGN UP</div>
          </Link>
        ) : (
          <Link to="/">
            <div className="navbar__register__signup" onClick={signOutUser}>
              SIGN OUT
            </div>
          </Link>
        )}
        <div
          className={adminPerson === true ? "navbar__admin" : "navbar__noAdmin"}
          onClick={redirectAdminPage}
        >
          Admin
        </div>
      </div>
      <div className="navbar__cart">
        <div className="navbar__cart__wrapper" onClick={goToCart}>
          <i className="fas fa-shopping-cart fa-2x" />
          <span className="cart__text">
            Cart
            <span className="navbar__cart__badge">{itemInCart}</span>
          </span>
        </div>
      </div>
      <div className="navbar__hamburger" onClick={flipBackDrop}>
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default NavBar;
