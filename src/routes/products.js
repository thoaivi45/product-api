const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// Chỉ nhận bốn trường của Product.
function pickProductFields(body = {}) {
  const data = {};

  for (const field of ["pid", "pname", "price", "quantity"]) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
  }

  return data;
}

// CREATE: Thêm sản phẩm.
router.post("/", async (req, res) => {
  const product = await Product.create(pickProductFields(req.body));
  res.status(201).json(product);
});

// READ: Lấy danh sách sản phẩm.
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ pid: 1 });
  res.json(products);
});

// READ: Lấy một sản phẩm theo pid.
router.get("/:pid", async (req, res) => {
  const product = await Product.findOne({ pid: req.params.pid });

  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  res.json(product);
});

// UPDATE: Cập nhật các trường được gửi lên.
router.patch("/:pid", async (req, res) => {
  const data = pickProductFields(req.body);

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Chưa có trường cần cập nhật" });
  }

  const product = await Product.findOneAndUpdate(
    { pid: req.params.pid },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  res.json(product);
});

// DELETE: Xóa sản phẩm theo pid.
router.delete("/:pid", async (req, res) => {
  const product = await Product.findOneAndDelete({ pid: req.params.pid });

  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  res.json({ message: "Đã xóa sản phẩm", pid: product.pid });
});

module.exports = router;
