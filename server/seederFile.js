const { Product } = require("./models/product");
require("dotenv").config();

const connectDB = require("./config/db");
const { products } = require("./data/initial_products");

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany({});

    await Product.insertMany(products);

    console.log("Products imported successfully into the database..");
    process.exit();
  } catch (ex) {
    console.log(ex);
    process.exit(1);
  }
};

importData();
