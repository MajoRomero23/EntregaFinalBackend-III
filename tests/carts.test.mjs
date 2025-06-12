import supertest from "supertest";
import http from "http";
import { expect } from "chai";
import app from "../app.js";

let requester;
let server;
let userToken = "";
let testCartId = "";
const testProductId = "674d0155d15b5381fd675c21";

describe("🛒 Pruebas de Carts API", () => {
  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(3005, () => {
      console.log("Servidor de pruebas en http://localhost:3005");
      requester = supertest.agent(server);
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      console.log("Servidor de pruebas cerrado");
      done();
    });
  });

  it("Debería obtener el token al loguearse", async () => {
    const response = await requester
      .post("/api/sessions/login")
      .send({
        email: "test@example.com",
        password: "pass123"
      });


    console.log("Login response:", response.status, response.body);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token");
    userToken = response.body.token;
  });

  it("Debería obtener el carrito del usuario autenticado", async () => {
    const res = await requester
      .get("/api/users/my-cart")
      .set("Authorization", `Bearer ${userToken}`);


    console.log("🛒 Carrito actual:", res.status, res.body);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("cartId");
    testCartId = res.body.cartId;
  });

  it("Debería agregar un producto al carrito", async () => {
    const res = await requester
      .post(`/api/carts/${testCartId}/product/${testProductId}`)
      .set("Authorization", `Bearer ${userToken}`);

 
    console.log("➕ Producto añadido:", res.status, res.body);
    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("Producto añadido al carrito");
  });

  it("Debería finalizar la compra y generar un ticket", async () => {
    const res = await requester
      .post(`/api/carts/${testCartId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    console.log("🎟️ Ticket generado:", res.status, res.body);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("ticket");
  });

  it("No debería permitir agregar producto sin token", async () => {
    const res = await requester
      .post(`/api/carts/${testCartId}/product/${testProductId}`);

    expect([401, 403]).to.include(res.status);
  });

  it("No debería permitir agregar producto con ID de carrito inválido", async () => {
    const res = await requester
      .post(`/api/carts/invalidCartId/product/${testProductId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect([400, 404]).to.include(res.status);
  });


  it("No debería permitir agregar producto con ID de carrito inválido", async () => {
    const res = await requester
      .post(`/api/carts/invalidCartId/product/${testProductId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect([400, 404]).to.include(res.status);
  });

  it("✅ Debería finalizar la compra y generar un ticket", async () => {
    const res = await requester
      .post(`/api/carts/${testCartId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("ticket");
  });
});
