import axios from "axios";
import React, { useState, useEffect } from "react";
import "./ProductScreen.css";
import { Link, useHistory } from "react-router-dom";

const ProductScreen = ({ productId, setItemsInCart }) => {
  const [uniqueProduct, setUniqueProduct] = useState({});
  const [reconProducts, setReconProducts] = useState([]);
  const [itemAdded, setItemAdded] = useState(false);
  const [products, setProducts] = useState([]);
  const history = useHistory();

  const setData = async (id) => {
    try {
      const newProducts = await axios.get(
        "https://youzcart.herokuapp.com/api/products"
      );
      const data = await axios.get(
        `https://youzcart.herokuapp.com/api/products/${id}`
      );
      setUniqueProduct(data.data);
      setProducts(newProducts.data);
      setItemsInCart();
      const d = data.data;
      let newReconArr = newProducts.data.filter((p) => {
        return (
          p.itemType === d.itemType && p._id !== d._id && p.kind === d.kind
        );
      });
      setReconProducts(newReconArr);
      let presentItems = JSON.parse(localStorage.getItem("storedItems"));
      const uniqueProductPresent = presentItems.filter((item) => {
        return item._id === d._id;
      });
      if (uniqueProductPresent.length > 0) {
        setItemAdded(true);
      } else {
        setItemAdded(false);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    setData(productId);
  }, []);

  const viewProduct = async (id) => {
    setData(id);
  };

  const addToStorage = () => {
    const isValidUser = JSON.parse(localStorage.getItem("Auth_Token"));
    if (isValidUser === null) {
      history.push("/login");
      return;
    }
    //localStorage.clear();
    let presentItems = JSON.parse(localStorage.getItem("storedItems"));
    if (presentItems) {
      let lengthInitial = presentItems.length;
      presentItems = presentItems.filter((item) => {
        return item._id !== uniqueProduct._id;
      });
      if (presentItems.length === lengthInitial) {
        uniqueProduct["counter"] = 1;
        presentItems.push(uniqueProduct);
        setItemAdded(true);
      } else {
        setItemAdded(false);
      }
      localStorage.setItem("storedItems", JSON.stringify(presentItems));
    } else {
      const storedItems = [];
      storedItems.push(uniqueProduct);
      for (let i = 0; i < storedItems.length; i++) {
        storedItems[i]["counter"] = 1;
      }
      setItemAdded(true);
      setItemsInCart();
      localStorage.setItem("storedItems", JSON.stringify(storedItems));
    }
    setItemsInCart();
  };

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__details__image">
          <img src={uniqueProduct.imageURL} alt={uniqueProduct.name} />
        </div>
        <div className="product__details__section">
          <div className="product__brand">
            Brand:{" "}
            {uniqueProduct.name == undefined
              ? ""
              : uniqueProduct.name.split(" ")[0]}
          </div>
          <div className="product__name">{uniqueProduct.name}</div>
          <div className="product__rev__rat">
            <p className="product__ratings">{uniqueProduct.ratings}</p>
            <i className="fas fa-star" />
            <p className="product__seperator">|</p>
            <p className="product__reviews">{uniqueProduct.reviews} reviews</p>
          </div>
          <div className="product__price">Rs. {uniqueProduct.price}</div>
          <div className="product__description">
            <p className="product__description__head">Description: </p>
            <p className="product__description__body">
              {uniqueProduct.description}
            </p>
          </div>
          <div className="product__add__cart">
            <div className="product__cart" onClick={addToStorage}>
              {itemAdded === false ? "Add To Cart" : "Remove From Cart"}
            </div>
          </div>
        </div>
      </div>
      <div className="product__recon__head">Products related to this item</div>
      <div className="product__recon">
        {reconProducts.map((product) => (
          <div className="product__recon__wrapper" key={product.name}>
            <div className="product__recon__img">
              <img src={product.imageURL} alt={product.name} />
            </div>
            <div className="product__recon__desc">
              <p className="product__recon__name">{product.name}</p>
              <div className="product__recon__ratings">
                <p className="product__recon__ratings__text">
                  {product.ratings}
                </p>
                <i className="fas fa-star" />
              </div>
              <p className="product__recon__price">Rs. {product.price}</p>
              <Link to={`/product/${product._id}`}>
                <p
                  className="product__recon__view"
                  onClick={() => viewProduct(product._id)}
                >
                  View
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductScreen;
