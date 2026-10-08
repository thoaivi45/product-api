const test = require("node:test");
const assert = require("node:assert/strict");
const Product = require("../src/models/product");

test("Chấp nhận sản phẩm hợp lệ", async () => {
  const product = new Product({
    pid: "P001",
    pname: "Chuot Logitech",
    price: 250000,
    quantity: 10,
  });

  await assert.doesNotReject(() => product.validate());
});

test("Từ chối sản phẩm thiếu pname", async () => {
  const product = new Product({
    pid: "P002",
    price: 100000,
    quantity: 5,
  });

  await assert.rejects(
    () => product.validate(),
    (error) =>
      error.name === "ValidationError" && Boolean(error.errors.pname)
  );
});

test("Từ chối giá âm", async () => {
  const product = new Product({
    pid: "P003",
    pname: "Ban phim",
    price: -1000,
    quantity: 5,
  });

  await assert.rejects(
    () => product.validate(),
    (error) =>
      error.name === "ValidationError" && Boolean(error.errors.price)
  );
});

test("Từ chối số lượng không nguyên", async () => {
  const product = new Product({
    pid: "P004",
    pname: "Tai nghe",
    price: 150000,
    quantity: 1.5,
  });

  await assert.rejects(
    () => product.validate(),
    (error) =>
      error.name === "ValidationError" && Boolean(error.errors.quantity)
  );
});