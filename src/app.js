const express = require("express");
const productRoutes = require("./routes/products");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/products", productRoutes);

//Thêm endpoint /health
const mongoose = require("mongoose");

app.get("/health", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: "unhealthy",
        database: "disconnected",
      });
    }

    await mongoose.connection.db.admin().command(
      { ping: 1 },
      { timeoutMS: 2000 }
    );

    res.status(200).json({
      status: "healthy",
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "unhealthy",
      database: "unavailable",
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint không tồn tại" });
});

// Express 5 chuyển lỗi từ các async handler đến middleware này.
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({ message: "pid đã tồn tại" });
  }

  if (
    err.name === "ValidationError" ||
    err.name === "CastError" ||
    err.type === "entity.parse.failed"
  ) {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: "Lỗi hệ thống" });
});

module.exports = app;