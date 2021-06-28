import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";
import { useHistory } from "react-router";
import { validateNewProduct } from "../components/validate_new_pdt";

const AdminPage = () => {
  const history = useHistory();
  const [prevProducts, setPrevProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ratings, setRatings] = useState("");
  const [reviews, setReviews] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [itemType, setItemType] = useState("");
  const [kind, setKind] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(async () => {
    try {
      const verifyAdmin = JSON.parse(localStorage.getItem("isAdmin"));
      if (!verifyAdmin) {
        history.replace("/");
        return;
      }
      const prevData = await axios.get(
        "https://youzcart.herokuapp.com/api/products"
      );
      setPrevProducts(prevData.data);
    } catch (ex) {
      console.log(ex);
    }
  }, []);

  const handleName = (e) => {
    setError("");
    setName(e.target.value);
  };
  const handlePrice = (e) => {
    setError("");
    setPrice(Number(e.target.value));
  };
  const handleRatings = (e) => {
    setError("");
    setRatings(Number(e.target.value));
  };
  const handleReviews = (e) => {
    setError("");
    setReviews(Number(e.target.value));
  };
  const handleStock = (e) => {
    setError("");
    setCountInStock(Number(e.target.value));
  };
  const handleDiscount = (e) => {
    setError("");
    setDiscount(Number(e.target.value));
  };
  const handleImage = (e) => {
    setError("");
    setImageURL(e.target.value);
  };
  const handleType = (e) => {
    setError("");
    setItemType(e.target.value);
  };
  const handleKind = (e) => {
    setError("");
    setKind(e.target.value);
  };
  const handleDescription = (e) => {
    setError("");
    setDescription(e.target.value);
  };

  const addNewProduct = async () => {
    try {
      const isValidProduct = validateNewProduct(
        name,
        price,
        ratings,
        reviews,
        countInStock,
        discount,
        imageURL,
        itemType,
        kind,
        description
      );
      if (isValidProduct !== "valid") {
        setError(isValidProduct);
        return;
      }
      console.log("Hey");
      setError("");
      const result = await axios.post(
        "https://youzcart.herokuapp.com/api/products",
        {
          name: name,
          price: price,
          ratings: ratings,
          reviews: reviews,
          countInStock: countInStock,
          discount: discount,
          imageURL: imageURL,
          itemType: itemType,
          kind: kind,
          description: description,
        }
      );
      window.location.reload();
    } catch (ex) {
      console.log(ex);
      setError(ex.response.data);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://youzcart.herokuapp.com/api/products/${id}`);
      window.location.reload();
    } catch (ex) {
      console.log(ex);
      setError(ex.response.message);
    }
  };

  return (
    <div className="admin">
      <div className="admin__wrapper">
        <div className="admin__add__tocart">Add Item To Cart</div>
        <div className="admin__error">{error}</div>
        <div className="admin__product">
          <span className="admin__product__name">Product Name:</span>
          <span className="admin__product__name__field">
            <input
              type="text"
              className="admin__text__field"
              placeholder="Product Name"
              size="120"
              onChange={handleName}
            />
          </span>
        </div>
        <div className="admin__product">
          <span className="admin__product__name">Price:</span>
          <span className="admin__product__name__field">
            <input
              type="text"
              className="admin__text__field"
              placeholder="Product Price"
              size="120"
              onChange={handlePrice}
            />
          </span>
        </div>
        <div className="admin__product">
          <span className="admin__product__name">Ratings:</span>
          <span className="admin__product__name__field">
            <input
              type="text"
              className="admin__text__field"
              placeholder="Ratings"
              size="120"
              onChange={handleRatings}
            />
          </span>
        </div>
        <div className="admin__product">
          <span className="admin__product__name">Reviews:</span>
          <span className="admin__product__name__field">
            <input
              type="text"
              className="admin__text__field"
              placeholder="Reviews"
              size="120"
              onChange={handleReviews}
            />
          </span>
        </div>
        <div className="admin__product">
          <span className="admin__product__name">Count In Stock:</span>
          <span className="admin__product__name__field">
            <input
              type="text"
              className="admin__text__field"
              placeholder="Number in Stock"
              size="120"
              onChange={handleStock}
            />
          </span>
        </div>
        <div className="admin__product">
          <span className="admin__product__name">Discount:</span>
          <span className="admin__product__name__field">
            <input
              type="text"
              className="admin__text__field"
              placeholder="Discount"
              size="120"
              onChange={handleDiscount}
            />
          </span>
        </div>
        <div className="admin__product">
          <span className="admin__product__name">Image URL:</span>
          <span className="admin__product__name__field">
            <input
              type="text"
              className="admin__text__field"
              placeholder="Image URL"
              size="120"
              onChange={handleImage}
            />
          </span>
        </div>
        <div className="admin__product">
          <span className="admin__product__name">Item Type:</span>
          <span className="admin__product__name__field">
            <input
              type="text"
              className="admin__text__field"
              placeholder="Type of Product"
              size="120"
              onChange={handleType}
            />
          </span>
        </div>
        <div className="admin__product">
          <span className="admin__product__name">Age Group Category:</span>
          <span className="admin__product__name__field">
            <input
              type="text"
              className="admin__text__field"
              placeholder="Age Group"
              size="120"
              onChange={handleKind}
            />
          </span>
        </div>
        <div className="admin__product">
          <span className="admin__product__name">Description:</span>
          <span className="admin__product__name__field">
            <textarea
              cols="110"
              rows="10"
              className="admin__text__field admin__description"
              placeholder="Description"
              onChange={handleDescription}
            />
          </span>
        </div>
        <div className="admin__save__btn" onClick={addNewProduct}>
          Save
        </div>
      </div>
      <div className="admin__contained__products">
        <div className="product__contained__wrapper">
          <div className="admin__contained__products__head">Product</div>
          <div className="admin__contained__products__head">Product Name</div>
          <div className="admin__contained__products__head">Product Price</div>
          <div className="admin__contained__products__head">Product Count</div>
          <div className="admin__contained__products__head">
            Product Ratings
          </div>
          <div className="admin__contained__products__head">Delete Product</div>
        </div>
        {prevProducts.map((product) => (
          <div className="admin__prev__products" key={product._id}>
            <div className="admin__product__image">
              <img src={product.imageURL} alt={product.name} />
            </div>
            <div className="admin__pproduct__name">{product.name}</div>
            <div className="admin__pproduct__name">{product.price}</div>
            <div className="admin__pproduct__name">{product.countInStock}</div>
            <div className="admin__pproduct__name">{product.ratings}</div>
            <div
              className="admin__pproduct__name"
              onClick={() => deleteProduct(product._id)}
            >
              <i className="fas fa-trash-alt" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
