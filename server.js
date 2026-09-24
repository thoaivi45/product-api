require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();


// Middleware cho phép đọc JSON
app.use(express.json());


// Route kiểm tra API
app.get("/", (req, res) => {
  res.json({
    message: "Product API is running",
  });
});


// Product routes
app.use("/api/products", productRoutes);


// Khởi động server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();