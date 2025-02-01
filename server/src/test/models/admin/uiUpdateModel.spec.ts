import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UiUpdate from "../../../models/admin/uiUpdateModel";

describe("UiUpdate Model", () => {
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

  it("should create a UiUpdate successfully", async () => {
    const uiUpdateData = {
      adminId: new mongoose.Types.ObjectId(), // Mocked adminId as ObjectId
      heroImage: ["image1.jpg", "image2.jpg"],
      heroText: ["Welcome", "To Our Site"],
    };

    const uiUpdate = new UiUpdate(uiUpdateData);
    await uiUpdate.save();

    const foundUiUpdate = await UiUpdate.findById(uiUpdate._id);
    expect(foundUiUpdate).to.not.be.null;
    expect(foundUiUpdate?.heroImage).to.deep.equal(uiUpdateData.heroImage);
    expect(foundUiUpdate?.heroText).to.deep.equal(uiUpdateData.heroText);
    expect(foundUiUpdate?.adminId.toString()).to.equal(uiUpdateData.adminId.toString());
  });

  it("should throw an error if required fields are missing", async () => {
    const uiUpdateData = {
      adminId: new mongoose.Types.ObjectId(), // Mocked adminId as ObjectId
      heroImage: [],
      heroText: [],  // Missing required fields
    };

    const uiUpdate = new UiUpdate(uiUpdateData);

    try {
      await uiUpdate.save();
    } catch (error: any) {
      expect(error.errors.heroImage).to.exist;
      expect(error.errors.heroText).to.exist;
    }
  });

  it("should automatically add createdAt and updatedAt timestamps", async () => {
    const uiUpdateData = {
      adminId: new mongoose.Types.ObjectId(), // Mocked adminId as ObjectId
      heroImage: ["image1.jpg"],
      heroText: ["Welcome to the Admin Dashboard"],
    };

    const uiUpdate = new UiUpdate(uiUpdateData);
    await uiUpdate.save();

    const foundUiUpdate = await UiUpdate.findById(uiUpdate._id);
    expect(foundUiUpdate?.createdAt).to.be.instanceOf(Date);
    expect(foundUiUpdate?.updatedAt).to.be.instanceOf(Date);
  });
});
