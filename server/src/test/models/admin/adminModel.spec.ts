import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Admin from "../../../models/admin/adminModel";

describe("Admin Model", () => {
  let mongoServer: MongoMemoryServer;
  let connection: mongoose.Mongoose;

  before(async () => {
    // Start an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory MongoDB
    connection = await mongoose.connect(mongoUri);
  });

  after(async () => {
    // Close the connection and stop the in-memory server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should create an admin successfully", async () => {
    const adminData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      isVerified: true,
    };

    const admin = new Admin(adminData);

    // Save admin to the database
    await admin.save();

    // Find the admin from the database
    const foundAdmin = await Admin.findOne({ email: adminData.email });

    expect(foundAdmin).to.not.be.null;
    expect(foundAdmin?.name).to.equal(adminData.name);
    expect(foundAdmin?.email).to.equal(adminData.email);
    expect(foundAdmin?.isVerified).to.equal(adminData.isVerified);
  });

  it("should throw an error if email is not unique", async () => {
    const adminData = {
      name: "Jane Doe",
      email: "john.doe@example.com", // Duplicate email
      password: "password123",
      isVerified: true,
    };

    const admin = new Admin(adminData);

    try {
      await admin.save();
    } catch (error) {
      expect(error).to.have.property("code", 11000); // MongoDB duplicate key error code
    }
  });

  it("should set default refreshToken as null", async () => {
    const adminData = {
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      isVerified: true,
    };

    const admin = new Admin(adminData);
    await admin.save();

    const foundAdmin = await Admin.findOne({ email: adminData.email });
    expect(foundAdmin?.refreshToken).to.be.null;
  });

  it("should automatically add createdAt and updatedAt timestamps", async () => {
    const adminData = {
      name: "Bob",
      email: "bob@example.com",
      password: "password123",
      isVerified: true,
    };

    const admin = new Admin(adminData);
    await admin.save();

    const foundAdmin = await Admin.findOne({ email: adminData.email });
    expect(foundAdmin?.createdAt).to.be.instanceOf(Date);
    expect(foundAdmin?.updatedAt).to.be.instanceOf(Date);
  });
});
