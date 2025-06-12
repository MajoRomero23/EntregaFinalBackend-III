import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import http from "http";
import connectDB from "../src/database.js";

let server;
let requester;
let userToken;

const testUser = {
  first_name: "Test",
  last_name: "User",
  email: "test@example.com",
  age: 25,
  password: "pass123",
};

beforeAll(async () => {
  await connectDB();
  server = http.createServer(app);
  requester = supertest(server);
  server.listen(3007, () => console.log("Servidor de sesiones corriendo en http://localhost:3007"));
});

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) =>
    server.close(() => {
      console.log("Servidor de sesiones cerrado");
      resolve();
    })
  );
});


describe("Sessions API Tests", () => {
  test("Debería iniciar sesión con credenciales válidas", async () => {
    const loginRes = await requester.post("/api/sessions/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    console.log("Login:", loginRes.status, loginRes.body);
    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    userToken = loginRes.body.token;
  });

  test("No debería iniciar sesión con contraseña incorrecta", async () => {
    const res = await requester.post("/api/sessions/login").send({
      email: testUser.email,
      password: "incorrecta",
    });

    console.log("Login Incorrecto:", res.status, res.body);
    expect(res.status).toBe(400); 
  });

  test("Debería obtener la sesión actual del usuario autenticado", async () => {
    const res = await requester
      .get("/api/sessions/current")
      .set("Authorization", `Bearer ${userToken}`);

    console.log("👤 Sesión actual:", res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });
});
