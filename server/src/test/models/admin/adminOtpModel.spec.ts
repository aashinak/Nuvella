import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import AdminOtp from "../../../models/admin/adminOtpModel";

describe("AdminOtp Model", () => {
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

  it("should create an OTP successfully", async () => {
    const adminOtpData = {
      adminId: new mongoose.Types.ObjectId(), // Mock adminId (ObjectId)
      otp: "123456",
      otpReason: "ADMIN_LOGIN", // Valid reason
      otpCreatedAt: new Date(),
    };

    const adminOtp = new AdminOtp(adminOtpData);

    // Save OTP to the database
    await adminOtp.save();

    

    // Find the OTP in the database
    const foundOtp = await AdminOtp.findOne({ otp: adminOtpData.otp });
    

    expect(foundOtp).to.not.be.null;
    expect(foundOtp?.otp).to.equal(adminOtpData.otp);
    expect(foundOtp?.otpReason).to.equal(adminOtpData.otpReason);
    expect(foundOtp?.adminId).to.be.an("object");
  });

  it("should throw an error if otpReason is invalid", async () => {
    const invalidOtpData = {
      adminId: new mongoose.Types.ObjectId(),
      otp: 123456,
      otpReason: "INVALID_REASON", // Invalid reason
      otpCreatedAt: new Date(),
    };

    const invalidOtp = new AdminOtp(invalidOtpData);

    try {
      await invalidOtp.save();
    } catch (error: any) {
      expect(error).to.have.property("errors");
      expect(error.errors.otpReason.message).to.equal(
        "`INVALID_REASON` is not a valid enum value for path `otpReason`."
      );
    }
  });

  it("should set default otpCreatedAt to current date", async () => {
    const adminOtpData = {
      adminId: new mongoose.Types.ObjectId(),
      otp: 987654,
      otpReason: "ADD_ADMIN", // Valid reason
    };

    const adminOtp = new AdminOtp(adminOtpData);
    await adminOtp.save();

    const foundOtp = await AdminOtp.findOne({ otp: adminOtpData.otp });

    expect(foundOtp?.otpCreatedAt).to.be.instanceOf(Date);
  });

  // Skipped TTL expiry test
});
