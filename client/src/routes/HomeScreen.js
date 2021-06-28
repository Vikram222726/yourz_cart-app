import React, { useState, useEffect } from "react";
import "./HomeScreen.css";
import { Link } from "react-router-dom";
import axios from "axios";

const HomeScreen = ({ getProductId, setItemsInCart, kindofProduct }) => {
  const [screenProducts, setScreenProducts] = useState([]);

  useEffect(async () => {
    try {
      const newProducts = await axios.get(
        "https://youzcart.herokuapp.com/api/products"
      );
      if (kindofProduct !== "All") {
        const newArr = newProducts.data.filter((p) => {
          return p.kind === kindofProduct;
        });
        setScreenProducts(newArr);
      } else {
        setScreenProducts(newProducts.data);
      }

      setItemsInCart();
    } catch (ex) {
      console.log(ex);
    }
  }, [kindofProduct]);

  const [activeFilter, setActiveFilter] = useState([
    false,
    false,
    false,
    false,
  ]);

  const applyFilter = (id) => {
    let newFilterArr = [false, false, false, false];
    newFilterArr[id] = !activeFilter[id];
    let newProducts;
    if (id === 0 && activeFilter[id] === false) {
      screenProducts.sort((a, b) => (a.price > b.price ? 1 : -1));
      setScreenProducts(screenProducts);
    } else if (id === 1 && activeFilter[id] === false) {
      screenProducts.sort((a, b) => (a.ratings < b.ratings ? 1 : -1));
      setScreenProducts(screenProducts);
    } else if (id === 2 && activeFilter[id] === false) {
      screenProducts.sort((a, b) => (a.reviews < b.reviews ? 1 : -1));
      setScreenProducts(screenProducts);
    } else if (id === 3 && activeFilter[id] === false) {
      screenProducts.sort((a, b) => (a.countInStock < b.countInStock ? 1 : -1));
      setScreenProducts(screenProducts);
    } else {
      screenProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
      setScreenProducts(screenProducts);
    }

    setActiveFilter(newFilterArr);
  };

  return (
    <div className="home">
      <div className="home__filter">
        <div className="home__filter__text__wrapper">
          <div className="home__filter__wrapper">
            <h4 className="home__filter__text">Filter</h4>
            <i className="fas fa-filter" />
          </div>
        </div>
        <div />
        <div className="home__filter__price__wrapper">
          <p
            className={
              activeFilter[0] === true
                ? "home__filter__price filter__active"
                : "home__filter__price"
            }
            onClick={() => applyFilter(0)}
          >
            Price
          </p>
        </div>
        <div className="home__filter__price__wrapper">
          <p
            className={
              activeFilter[1] === true
                ? "home__filter__price filter__active"
                : "home__filter__price"
            }
            onClick={() => applyFilter(1)}
          >
            Ratings
          </p>
        </div>
        <div className="home__filter__price__wrapper">
          <p
            className={
              activeFilter[2] === true
                ? "home__filter__price filter__active"
                : "home__filter__price"
            }
            onClick={() => applyFilter(2)}
          >
            Reviews
          </p>
        </div>
        <div className="home__filter__price__wrapper">
          <p
            className={
              activeFilter[3] === true
                ? "home__filter__price filter__active"
                : "home__filter__price"
            }
            onClick={() => applyFilter(3)}
          >
            No In Stock
          </p>
        </div>
        <div />
      </div>
      <div className="home__container">
        {screenProducts.map((product) => (
          <div className="home__container__wrapper" key={product._id}>
            <div className="product__info">
              <div className="product__info__image">
                <img
                  src={product.imageURL === undefined ? "" : product.imageURL}
                  alt={product.name}
                />
                <p className="product__info__discount">
                  <span className="product__info__discount__no">
                    {product.discount === undefined ? "" : product.discount}
                  </span>
                  <span className="product__info__discount__off">%</span>
                </p>
              </div>
              <div className="product__rest__info">
                <p className="product__info__name">
                  {product.name === undefined
                    ? ""
                    : product.name.split(" ")[0].toLocaleUpperCase()}
                </p>
                <p className="product__info__name__second">
                  {product.name === undefined
                    ? ""
                    : product.name.split(" ").slice(1).join(" ")}
                </p>
                <p className="product__info__price">
                  Rs. {product.price === undefined ? "" : product.price}
                </p>
                <div className="product__info__rat__rev">
                  <p className="product__info__ratings">
                    {product.ratings === undefined ? "" : product.ratings}
                  </p>
                  <i className="fas fa-star" />
                  <p className="product__info__seperate">|</p>
                  <p className="product__info__ratings">
                    {product.reviews === undefined ? "" : product.reviews}
                  </p>
                </div>
              </div>
              <div
                className="product__view"
                onClick={() => getProductId(product._id)}
              >
                <Link
                  to={`/product/${product._id}`}
                  className="product__view__link"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
