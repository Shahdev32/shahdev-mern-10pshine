// tests/notes.test.js
process.env.NODE_ENV = "test";
process.env.ACCESS_TOKEN_SECRET = "testsecret";

const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const mongoose = require("mongoose");
const { connect, closeDatabase, clearDatabase } = require("./setup");

const app = require("../index"); // your Express app
const User = require("../models/user.model");
const Note = require("../models/note.model");

describe("Notes API Tests", () => {
  let user;
  let token;
  let noteId;

  // Connect to in-memory DB before all tests
  before(async () => {
    await connect();
  });

  // Clear DB after each test
  afterEach(async () => {
    await clearDatabase();
  });

  // Close DB after all tests
  after(async () => {
    await closeDatabase();
  });

  // Create a user and token before each test
  beforeEach(async () => {
    user = await new User({
      fullName: "Note Test User",
      email: "noteuser@example.com",
      password: await require("bcryptjs").hash("password123", 10),
    }).save();

    token = require("jsonwebtoken").sign({ user }, process.env.ACCESS_TOKEN_SECRET);

    const note = await new Note({
      title: "Initial Note",
      content: "Initial Content",
      userId: user._id,
    }).save();

    noteId = note._id;
  });

  // ------------------ Add Note ------------------
  it("should add a note", async () => {
    const res = await request(app)
      .post("/add-note")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Note",
        content: "This is a test note",
        tags: ["test", "note"],
      });

    expect(res.status).to.equal(200);
    expect(res.body.error).to.be.false;
    expect(res.body.note).to.have.property("title", "Test Note");
    expect(res.body.note.tags).to.include("test");
  });

  // ------------------ Get All Notes ------------------
  it("should get all notes for a user", async () => {
    await new Note({
      title: "Second Note",
      content: "More content",
      userId: user._id,
    }).save();

    const res = await request(app)
      .get("/get-all-notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.notes).to.have.lengthOf(2);
    expect(res.body.notes[0]).to.have.property("title");
  });

  // ------------------ Edit Note ------------------
  it("should edit a note", async () => {
    const res = await request(app)
      .put(`/edit-note/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title", content: "Updated Content" });

    expect(res.status).to.equal(200);
    expect(res.body.note.title).to.equal("Updated Title");
    expect(res.body.note.content).to.equal("Updated Content");
  });

  // ------------------ Update Pinned ------------------
  it("should update isPinned", async () => {
    const res = await request(app)
      .put(`/update-note-pinned/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isPinned: true });

    expect(res.status).to.equal(200);
    expect(res.body.note.isPinned).to.be.true;
  });

  // ------------------ Search Notes ------------------
  it("should search notes", async () => {
    await new Note({
      title: "Searchable Note",
      content: "Some searchable content",
      userId: user._id,
    }).save();

    const res = await request(app)
      .get("/search-notes?query=Searchable")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.notes).to.have.lengthOf(1);
    expect(res.body.notes[0].title).to.equal("Searchable Note");
  });

  // ------------------ Delete Note ------------------
  it("should delete a note", async () => {
    const res = await request(app)
      .delete(`/delete-note/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Note deleted successfully");

    const note = await Note.findById(noteId);
    expect(note).to.be.null;
  });
});
