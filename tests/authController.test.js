const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();
const app = require("../app");

const { DB_HOST, PORT } = process.env;

describe("test auth routes", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(PORT);
    mongoose.connect(DB_HOST);
  });

  afterAll(async () => {
    server.close();
    mongoose.disconnect(DB_HOST);
  });

  test("test login route", async () => {
    const loginUser = {
      email: "example@example.com",
      password: "11111111",
    };

    const response = await request(app).post("/api/auth/login").send(loginUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty(
      "user",
      expect.stringContaining("email"),
      expect.stringContaining("subscription")
    );
  });
});
