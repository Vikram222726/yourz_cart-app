import React, { useState, useEffect } from "react";
import "./Cart.css";
import axios from "axios";
import { useHistory } from "react-router";

const Cart = ({ setItemsInCart }) => {
  const history = useHistory();
  const [productCart, setProductCart] = useState([]);
  const [productCounter, setProductCounter] = useState([]);
  const [combinePrice, setCombinePrice] = useState(0);
  const [ttlItems, setTtlItems] = useState(0);
  const [prevOrderList, setPrevOrderList] = useState([]);

  useEffect(async () => {
    const verifyToken = JSON.parse(localStorage.getItem("Auth_Token"));
    if (!verifyToken) {
      history.replace("/login");
      return;
    }
    let cartItems = JSON.parse(localStorage.getItem("storedItems"));
    const newArr = [];
    let sum = 0,
      items = 0,
      newProductCart = [];
    if (cartItems) {
      for (let i = 0; i < cartItems.length; i++) {
        newArr.push(cartItems[i].counter);
        sum += cartItems[i].counter * cartItems[i].price;
        items += cartItems[i].counter;
        newProductCart.push(cartItems[i]);
      }
    }

    setTtlItems(items);
    setCombinePrice(sum);
    setProductCounter(newArr);
    setProductCart(newProductCart);
    setItemsInCart();

    const mail = JSON.parse(localStorage.getItem("email"));
    const objectsList = await axios.get(
      `https://youzcart.herokuapp.com/api/order_list?email=${mail}`
    );
    if (objectsList) {
      setPrevOrderList(objectsList.data);
    }
  }, []);

  const updateCounter = (val, id) => {
    let itemsCounter = JSON.parse(localStorage.getItem("storedItems"));
    let ttlItem = ttlItems,
      sum = combinePrice;
    let newArr = [];
    if (itemsCounter) {
      for (let i = 0; i < itemsCounter.length; i++) {
        if (itemsCounter[i]._id === id) {
          if (itemsCounter[i].counter === 0 && val === -1) {
            return;
          }
          if (
            itemsCounter[i].countInStock === itemsCounter[i].counter &&
            val === 1
          ) {
            return;
          }
          itemsCounter[i].counter += val;
          ttlItem += val;
          sum += val * itemsCounter[i].price;
        }
        newArr.push(itemsCounter[i].counter);
      }
      setCombinePrice(sum);
      setTtlItems(ttlItem);
      setProductCounter(newArr);
      setProductCart(itemsCounter);
      localStorage.setItem("storedItems", JSON.stringify(itemsCounter));
      setItemsInCart();
    }
  };

  const deleteItem = (id) => {
    let newArr,
      sum = 0,
      itemsCount = 0;
    newArr = productCart.filter((product) => {
      return product._id !== id;
    });
    for (let i = 0; i < newArr.length; i++) {
      sum += newArr[i].counter * newArr[i].price;
      itemsCount += newArr[i].counter;
    }
    setTtlItems(itemsCount);
    setCombinePrice(sum);
    setProductCart(newArr);
    localStorage.setItem("storedItems", JSON.stringify(newArr));
    setItemsInCart();
  };

  const buyProducts = async () => {
    try {
      let presentItems = JSON.parse(localStorage.getItem("storedItems"));
      let newOrderList = presentItems;
      const mail = JSON.parse(localStorage.getItem("email"));

      const result = await axios.post(
        "https://youzcart.herokuapp.com/api/order_list",
        {
          email: mail,
          orderListItems: newOrderList,
        }
      );
      localStorage.setItem("storedItems", JSON.stringify([]));
      setItemsInCart();
      history.push("/");
    } catch (ex) {
      console.log(ex.message);
    }
  };

  return (
    <div className="cart">
      <div className="cart__wrapper">
        <div className="cart__header">
          <div className="cart__header__text">Shopping Cart</div>
          <div className="cart__header__price">Price</div>
          {productCart.map((item) => (
            <div className="cart__products" key={item._id}>
              <div className="cart__products__media">
                <img src={item.imageURL} alt={item.name} />
              </div>
              <div className="cart__products__details">
                <p className="cart__products__name">{item.name}</p>
                <p className="cart__products__instock">{`In Stock: ${item.countInStock}`}</p>
                <p className="cart__products__review">{`Reviews: ${item.reviews}`}</p>
                <div className="cart__products__counters">
                  <div
                    className="cart__button"
                    onClick={() => updateCounter(1, item._id)}
                  >
                    +
                  </div>
                  <div className="cart__counter__value">{item.counter}</div>
                  <div
                    className="cart__button"
                    onClick={() => updateCounter(-1, item._id)}
                  >
                    -
                  </div>
                  <p className="cart__seperator">|</p>
                  <div
                    className="cart__products__delete"
                    onClick={() => deleteItem(item._id)}
                  >
                    <i className="fas fa-trash-alt" />
                  </div>
                </div>
              </div>
              <div className="cart__product__price">
                <span>Rs </span>
                <span className="cart__product__price__no">
                  {item.price}.00
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="cart__checkout">
          <div className="cart__checkout__notify">
            {prevOrderList.length === 0 ? (
              <>
                <div className="cart__checkout__icon">
                  <i className="fas fa-check" />
                </div>
                <div className="cart__checkout__notify__text">
                  We noticed this is your First order in this category. Your
                  order qualifies for FREE Delivery.
                </div>
              </>
            ) : (
              <div className="cart__checkout__notify__text cart__nopayment">
                This website is Created for learning purpose and hence{" "}
                <b>PAYMENT GATEWAY</b> is not added yet!
              </div>
            )}
          </div>
          <div className="cart__checkout__price">
            <span className="cart__price__items">{`Subtotal (${ttlItems} items): `}</span>
            <span className="cart__price__rate">
              <span className="cart__price__Rs">Rs </span>
              {combinePrice}.00
            </span>
          </div>
          <div className="cart__checkout__proceedtobuy" onClick={buyProducts}>
            Proceed To Buy
          </div>
        </div>
      </div>
      {prevOrderList.length > 0 ? (
        <div className="cart__prev__orders">
          <div className="cart__prev__header">Previous Orders</div>
          <div className="cart__order__wrapper">
            <div className="cart__order__details">Order ID</div>
            <div className="cart__order__details cart__order__date">
              Order Date
            </div>
          </div>
          {prevOrderList.map((prevOrder) => (
            <div className="cart__partition" key={prevOrder._id}>
              <div className="cart__prev__products">
                <div className="cart__prev__details">{prevOrder._id}</div>
                <div className="cart__prev__details cart__order__date">
                  {prevOrder.date}
                </div>
              </div>
              {prevOrder.orderListItems.map((item) => (
                <div className="cart__array__products" key={item._id}>
                  <div className="cart__order__image">
                    <img src={item.imageURL} alt={item.name} />
                  </div>
                  <div className="cart__order__productdetail">{item.name}</div>
                  <div className="cart__order__productdetail">
                    {item.counter}
                  </div>
                  <div className="cart__order__productdetail">
                    {item.counter * item.price}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Cart;
