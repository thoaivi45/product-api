const test = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");

const baseUrl = process.env.API_BASE_URL || "http://127.0.0.1:3001";

async function request(method, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

test("Kiểm thử Product API với MongoDB", async (t) => {
  const pid = `CI-${randomUUID()}`;
  const path = `/api/products/${pid}`;

  const product = {
    pid,
    pname: "San pham kiem thu CI",
    price: 250000,
    quantity: 10,
  };

  // Dọn sản phẩm thử ngay cả khi một bước kiểm thử thất bại.
  t.after(async () => {
    const result = await request("DELETE", path);
    assert.ok([200, 404].includes(result.status));
  });

  await t.test("Healthcheck trả 200 và database connected", async () => {
    const result = await request("GET", "/health");

    assert.equal(result.status, 200);
    assert.equal(result.body.status, "healthy");
    assert.equal(result.body.database, "connected");
  });

  await t.test("POST tạo sản phẩm", async () => {
    const result = await request("POST", "/api/products", product);

    assert.equal(result.status, 201);
    assert.ok(result.body._id);
    assert.equal(result.body.pid, pid);
    assert.equal(result.body.pname, product.pname);
    assert.equal(result.body.price, 250000);
    assert.equal(result.body.quantity, 10);
  });

  await t.test("POST trùng pid trả 409", async () => {
    const result = await request("POST", "/api/products", product);

    assert.equal(result.status, 409);
  });

  await t.test("GET danh sách chứa sản phẩm vừa tạo", async () => {
    const result = await request("GET", "/api/products");

    assert.equal(result.status, 200);
    assert.ok(Array.isArray(result.body));
    assert.ok(result.body.some((item) => item.pid === pid));
  });

  await t.test("GET chi tiết đúng sản phẩm", async () => {
    const result = await request("GET", path);

    assert.equal(result.status, 200);
    assert.equal(result.body.pid, pid);
    assert.equal(result.body.quantity, 10);
  });

  await t.test("PATCH cập nhật và lưu quantity vào database", async () => {
    const updated = await request("PATCH", path, { quantity: 15 });

    assert.equal(updated.status, 200);
    assert.equal(updated.body.quantity, 15);

    const saved = await request("GET", path);

    assert.equal(saved.status, 200);
    assert.equal(saved.body.quantity, 15);
  });

  await t.test("PATCH giá âm bị từ chối, giá cũ được giữ", async () => {
    const invalid = await request("PATCH", path, { price: -1 });

    assert.equal(invalid.status, 400);

    const saved = await request("GET", path);

    assert.equal(saved.status, 200);
    assert.equal(saved.body.price, 250000);
  });

  await t.test("DELETE xóa sản phẩm", async () => {
    const result = await request("DELETE", path);

    assert.equal(result.status, 200);
    assert.equal(result.body.pid, pid);
  });

  await t.test("GET sau khi xóa trả 404", async () => {
    const result = await request("GET", path);

    assert.equal(result.status, 404);
  });
});