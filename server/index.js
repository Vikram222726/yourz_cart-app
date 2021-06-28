const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const { productRouter } = require("./routes/products.js");
const { UserRouter } = require("./routes/users");
const { loginUserRouter } = require("./routes/login_user");
const { cartRouter } = require("./routes/cart_items");
const { orderListRouter } = require("./routes/order_list");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/products", productRouter);
app.use("/api/users", UserRouter);
app.use("/api/login", loginUserRouter);
app.use("/api/cart_item", cartRouter);
app.use("/api/order_list", orderListRouter);

const CONNECTION_URL =
  "mongodb+srv://user-1234:vikky1234@first-mern-app.0oqw7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.get("/", (req, res) => {
  res.send("Hello to Youz-Cart ");
});

const PORT = process.env.PORT || 8000;
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Successfully connected to MongoDB on PORT ${PORT}`)
    )
  )
  .catch((ex) => {
    console.log(ex);
  });

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

mongoose.set("useFindAndModify", false);
