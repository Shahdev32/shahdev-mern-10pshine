// tests/app.test.js
process.env.NODE_ENV = "test";
process.env.ACCESS_TOKEN_SECRET = "testsecret"; // for JWT
process.env.EMAIL = "test@gmail.com"; 
process.env.PASS = "testpassword";

const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../index");
const { connect, closeDatabase, clearDatabase } = require("./setup");
const User = require("../models/user.model");
const Note = require("../models/note.model");
const sinon = require("sinon");
const nodemailer = require("nodemailer");

describe("Backend API Tests", () => {
  let sendMailStub;

  // -------------------- Setup --------------------
  before(async () => {
    await connect();

    // Mock nodemailer to prevent real emails during tests
    sendMailStub = sinon.stub(nodemailer, "createTransport").returns({
      sendMail: sinon.fake.resolves({ messageId: "mocked-message-id" }),
    });
  });

  after(async () => {
    await closeDatabase();
    sendMailStub.restore(); // Restore original nodemailer
  });

  afterEach(async () => {
    await clearDatabase();
  });

  let accessToken;

  // -------------------- Test User Registration --------------------
  it("should register a new user", async () => {
    const res = await request(app).post("/create-account").send({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).to.equal(200);
    expect(res.body.error).to.be.false;
    expect(res.body.user).to.have.property("email", "test@example.com");
    accessToken = res.body.accessToken; // save token for further tests
  });

  // -------------------- Duplicate Registration --------------------
  describe("Duplicate Registration", () => {
    beforeEach(async () => {
      // create an initial user
      await new User({
        fullName: "Test User",
        email: "duplicate@example.com",
        password: await require("bcryptjs").hash("password123", 10),
      }).save();
    });

    it("should not allow registering with existing email", async () => {
      const res = await request(app)
        .post("/create-account")
        .send({
          fullName: "Another User",
          email: "duplicate@example.com",
          password: "password123",
        });

      expect(res.status).to.equal(200); // your route returns 200 with error object
      expect(res.body.error).to.be.true;
      expect(res.body.message).to.equal("User already exist");
    });
  });

  // -------------------- Test User Login --------------------
  it("should login a user", async () => {
    await new User({
      fullName: "Test User",
      email: "login@example.com",
      password: await require("bcryptjs").hash("password123", 10),
    }).save();

    const res = await request(app).post("/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.status).to.equal(200);
    expect(res.body.error).to.be.false;
    expect(res.body).to.have.property("accessToken");
    accessToken = res.body.accessToken;
  });

  // -------------------- Get Current User Info --------------------
  describe("Get Current User Info", () => {
    let user;
    let token;

    beforeEach(async () => {
      user = await new User({
        fullName: "Current User",
        email: "currentuser@example.com",
        password: await require("bcryptjs").hash("password123", 10),
      }).save();

      token = require("jsonwebtoken").sign(
        { user },
        process.env.ACCESS_TOKEN_SECRET
      );
    });

    it("should get current user info with valid token", async () => {
      const res = await request(app)
        .get("/get-user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.user).to.have.property("fullName", "Current User");
      expect(res.body.user).to.have.property("email", "currentuser@example.com");
      expect(res.body.user).to.have.property("_id");
      expect(res.body.user).to.have.property("createdOn");
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/get-user");
      expect(res.status).to.equal(401);
    });

    it("should return 401 for invalid token", async () => {
      const res = await request(app)
        .get("/get-user")
        .set("Authorization", `Bearer invalidtoken`);

      expect(res.status).to.equal(401);
    });
  });

  // -------------------- Test Forgot Password --------------------
  it("should create reset token", async () => {
    const user = await new User({
      fullName: "Forgot User",
      email: "forgot@example.com",
      password: await require("bcryptjs").hash("password123", 10),
    }).save();

    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "forgot@example.com" });

    expect(res.status).to.equal(200);

    const updatedUser = await User.findOne({ email: "forgot@example.com" });
    expect(updatedUser.resetToken).to.exist;
  });

});
