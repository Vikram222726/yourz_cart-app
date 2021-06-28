import React, { useState, useEffect } from "react";
import "./SideDrawer.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const SideDrawer = ({
  sidetoggle,
  flipBackDrop,
  filterProducts,
  itemInCart,
  admin,
  adminUser,
  setItemsInCart,
  toggleLogBtn,
  logBtn,
}) => {
  const [adminPerson, setAdminPerson] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("isAdmin");
    if (user !== null) {
      setAdminPerson(true);
    } else {
      setAdminPerson(false);
    }
  }, [admin, adminUser]);

  const SideDrawerClass = ["sidedrawer"];
  const history = useHistory();
  if (sidetoggle) {
    SideDrawerClass.push("show");
  }

  const getProducts = (kind) => {
    filterProducts(kind);
    flipBackDrop();
    history.replace("/");
  };

  const redirectAdmin = () => {
    flipBackDrop();
    history.push("/admin");
  };

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

  return (
    <div className={SideDrawerClass.join(" ")}>
      <ul className="sidebar">
        <li className="sidebar__select">
          <div
            className="sidebar__select__agegrp"
            onClick={() => getProducts("men")}
          >
            Male
          </div>
        </li>
        <li className="sidebar__select">
          <div
            className="sidebar__select__agegrp"
            onClick={() => getProducts("women")}
          >
            Female
          </div>
        </li>
        <li className="sidebar__select">
          <div
            className="sidebar__select__agegrp"
            onClick={() => getProducts("kids")}
          >
            Kids
          </div>
        </li>
        <li className="sidebar__cart" onClick={flipBackDrop}>
          <div className="sidebar__cart__wrapper">
            <Link to="/cart" className="cart__link">
              <i className="fas fa-shopping-cart" />
              <span className="sidebar__cart__text">
                <span className="sidebar__cart__text1">Cart</span>
                <span className="sidebar__cart__badge">{itemInCart}</span>
              </span>
            </Link>
          </div>
        </li>
        <li>
          <div
            className={
              adminPerson === true ? "sidebar__admin" : "sidebar__no__admin"
            }
            onClick={redirectAdmin}
          >
            Admin
          </div>
        </li>
        <li className="sidebar__signup" onClick={flipBackDrop}>
          {logBtn === false ? (
            <Link to="/register">
              <div className="sidebar__register__signup">SIGN UP</div>
            </Link>
          ) : (
            <Link to="/">
              <div className="sidebar__register__signup" onClick={signOutUser}>
                SIGN OUT
              </div>
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default SideDrawer;
