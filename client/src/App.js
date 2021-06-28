import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomeScreen from "./routes/HomeScreen";
import ProductScreen from "./routes/ProductScreen";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Cart from "./routes/Cart";
import AdminPage from "./routes/AdminPage";
import BackDrop from "./components/BackDrop";
import SideDrawer from "./components/SideDrawer";

const App = () => {
  const [sidetoggle, setSideToggle] = useState(false);
  const [backDrop, setBackDrop] = useState(false);
  const [logBtn, setLogBtn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [kindofProduct, setKindofProduct] = useState("All");
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [itemInCart, setItemInCart] = useState(0);
  const [dummyProducts, setDummyProducts] = useState([]);

  const flipBackDrop = () => {
    let newBackDrop;
    if (backDrop === true) {
      newBackDrop = false;
    } else {
      newBackDrop = true;
    }
    setBackDrop(newBackDrop);
    setSideToggle(newBackDrop);
  };

  const filterProducts = (ageType) => {
    setKindofProduct(ageType);
    if (products.length > 0) {
      let newProductArr = dummyProducts.filter((p) => {
        return p.kind === ageType;
      });
      setProducts(newProductArr);
    }
  };

  const adminUser = (flag) => {
    if (flag === false) {
      localStorage.removeItem("isAdmin");
    }
    setAdmin(flag);
  };

  const loadData = async () => {
    try {
      const newProducts = await axios.get(
        "https://youzcart.herokuapp.com/api/products"
      );
      let cartItemNumber = 0;
      let itemsCounter = JSON.parse(localStorage.getItem("storedItems"));
      if (itemsCounter) {
        for (let i = 0; i < itemsCounter.length; i++) {
          cartItemNumber += Number(itemsCounter[i].counter);
        }
      }
      setItemInCart(cartItemNumber);
      setProducts(newProducts.data);
      setDummyProducts(newProducts.data);
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(async () => {
    const result = await axios.get(
      "https://youzcart.herokuapp.com/api/products"
    );
    console.log(result);
    loadData();
  }, []);

  const getProductId = (id) => {
    setProductId(id);
  };

  const setItemsInCart = () => {
    let itemsCounter = JSON.parse(localStorage.getItem("storedItems"));
    if (itemsCounter) {
      let allItems = 0;
      for (let i = 0; i < itemsCounter.length; i++) {
        allItems += Number(itemsCounter[i].counter);
      }
      setItemInCart(allItems);
    } else {
      setItemInCart(0);
    }
  };

  function toggleLogBtn() {
    let presentItems = JSON.parse(localStorage.getItem("Auth_Token"));
    if (presentItems) {
      setLogBtn(true);
    } else {
      setLogBtn(false);
    }
  }

  return (
    <Router>
      <NavBar
        flipBackDrop={flipBackDrop}
        filterProducts={filterProducts}
        itemInCart={itemInCart}
        logBtn={logBtn}
        toggleLogBtn={toggleLogBtn}
        setItemsInCart={setItemsInCart}
        adminUser={adminUser}
        admin={admin}
      />
      {sidetoggle === true ? (
        <SideDrawer
          sidetoggle={sidetoggle}
          flipBackDrop={flipBackDrop}
          filterProducts={filterProducts}
          itemInCart={itemInCart}
          admin={admin}
          adminUser={adminUser}
          setItemsInCart={setItemsInCart}
          toggleLogBtn={toggleLogBtn}
          logBtn={logBtn}
        />
      ) : null}
      {backDrop === true ? <BackDrop flipBackDrop={flipBackDrop} /> : null}
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <HomeScreen
              getProductId={getProductId}
              setItemsInCart={setItemsInCart}
              kindofProduct={kindofProduct}
            />
          )}
        />
        <Route
          path="/product"
          render={() => (
            <ProductScreen
              productId={productId}
              setItemsInCart={setItemsInCart}
            />
          )}
        />
        <Route
          exact
          path="/login"
          render={() => (
            <Login
              setItemsInCart={setItemsInCart}
              toggleLogBtn={toggleLogBtn}
              adminUser={adminUser}
            />
          )}
        />
        <Route exact path="/register" component={Register} />
        <Route
          exact
          path="/cart"
          render={() => <Cart setItemsInCart={setItemsInCart} />}
        />
        <Route exact path="/admin" component={AdminPage} />
      </Switch>
    </Router>
  );
};

export default App;

//https://pensive-feynman-cfb0ce.netlify.app/
