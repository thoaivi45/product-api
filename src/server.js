require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const Product = require("./models/product");

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error("Thiếu MONGO_URI trong .env");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  // Đợi index unique của pid được tạo trước khi nhận request.
  await Product.init();

  console.log("MongoDB connected");

  const port = Number(process.env.PORT || 3000);

  app.listen(port, "0.0.0.0", () => {
    console.log(`Product API running on port ${port}`);
  });
}

start().catch((err) => {
  console.error("Startup failed:", err.message);
  process.exit(1);
});