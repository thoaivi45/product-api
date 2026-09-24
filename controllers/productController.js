const Product = require("../models/Product");

// CREATE - Tạo sản phẩm
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Product ID already exists",
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
};


// READ ALL - Lấy tất cả sản phẩm
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// READ ONE - Lấy sản phẩm theo pid
const getProductByPid = async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: req.params.pid,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE - Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        pid: req.params.pid,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// DELETE - Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: req.params.pid,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductByPid,
  updateProduct,
  deleteProduct,
};