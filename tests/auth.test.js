import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";

export const testAdmin = {
  id: 30,
  email: "testAdmin",
  password: "TestPass2",
  token: jwt.sign({ id: 30 }, process.env.JWT_SECRET),
};

describe("Authentication", () => {
  test("POST /api/v1/auth/login", (done) => {
    request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testAdmin.email,
        password: testAdmin.password,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 1;
        res.body.data[0].email = "test@example.com";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
