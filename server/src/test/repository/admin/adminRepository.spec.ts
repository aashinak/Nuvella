// import { expect } from "chai";
// import sinon from "sinon";
// import AdminRepository from "../../../repository/admin/adminRepository"; // Ensure this path is correct
// import Admin from "../../../models/admin/adminModel"; // Ensure this path is also correct
// import ApiError from "../../../utils/apiError"; // Ensure this path is also correct

// describe("AdminRepository", () => {
//   let sandbox: sinon.SinonSandbox;

//   beforeEach(() => {
//     sandbox = sinon.createSandbox(); // Create a sandbox for mocks and spies
//   });

//   afterEach(() => {
//     sandbox.restore(); // Restore the sandbox after each test
//   });

//   describe("createAdmin", () => {
//     it("should create a new admin", async () => {
//       const adminData = { name: "Admin", email: "admin@example.com", password: "password123", isVerified: false };

//       // Mock the save method of the Admin model
//       const saveStub = sandbox.stub(Admin.prototype, "save").resolves(adminData);

//       const result = await AdminRepository.createAdmin(adminData);

//       expect(saveStub.calledOnce).to.be.true; // Ensure save is called once
//       expect(result).to.deep.equal(adminData); // Ensure the result matches the expected data
//     });

//     it("should throw an error if creation fails", async () => {
//       const adminData = { name: "Admin", email: "admin@example.com", password: "password123", isVerified: false };

//       // Simulate an error during save
//       const saveStub = sandbox.stub(Admin.prototype, "save").rejects(new Error("Save failed"));

//       try {
//         await AdminRepository.createAdmin(adminData);
//         throw new Error("Test failed, error not thrown");
//       } catch (error: any) {
//         expect(error).to.be.instanceOf(ApiError);
//         expect(error.message).to.equal("Internal Server Error while creating admin");
//       }
//     });
//   });

//   describe("findByEmail", () => {
//     it("should find an admin by email", async () => {
//       const email = "admin@example.com";
//       const adminData = { name: "Admin", email, password: "password123" };

//       // Mock the findOne method of the Admin model
//       const findOneStub = sandbox.stub(Admin, "findOne").resolves(adminData);

//       const result = await AdminRepository.findByEmail(email);

//       expect(findOneStub.calledOnceWithExactly({ email })).to.be.true;
//       expect(result).to.deep.equal(adminData);
//     });

//     it("should return null if admin is not found", async () => {
//       const email = "nonexistent@example.com";

//       // Mock the findOne method of the Admin model
//       const findOneStub = sandbox.stub(Admin, "findOne").resolves(null);

//       const result = await AdminRepository.findByEmail(email);

//       expect(findOneStub.calledOnceWithExactly({ email })).to.be.true;
//       expect(result).to.be.null;
//     });
//   });

//   describe("findById", () => {
//     it("should find an admin by ID", async () => {
//       const id = "60b8d295f4c5c0071c78ab34";
//       const adminData = { name: "Admin", email: "admin@example.com", password: "password123" };

//       const findByIdStub = sandbox.stub(Admin, "findById").resolves(adminData);

//       const result = await AdminRepository.findById(id);

//       expect(findByIdStub.calledOnceWithExactly(id)).to.be.true;
//       expect(result).to.deep.equal(adminData);
//     });

//     it("should return null if admin is not found by ID", async () => {
//       const id = "nonexistentId";

//       const findByIdStub = sandbox.stub(Admin, "findById").resolves(null);

//       const result = await AdminRepository.findById(id);

//       expect(findByIdStub.calledOnceWithExactly(id)).to.be.true;
//       expect(result).to.be.null;
//     });
//   });

//   describe("updateById", () => {
//     it("should update an admin by ID", async () => {
//       const id = "60b8d295f4c5c0071c78ab34";
//       const updatedData = { name: "Updated Admin" };
//       const updatedAdmin = { 
//         _id: id, // Ensure ID is included for clarity
//         name: "Updated Admin", 
//         email: "admin@example.com", 
//         password: "password123" 
//       };

//       // Stub the findByIdAndUpdate method to return the updated admin
//       const findByIdAndUpdateStub = sandbox.stub(Admin, "findByIdAndUpdate").resolves(updatedAdmin);

//       const result = await AdminRepository.updateById(id, updatedData);

//       // Assertion: Ensure findByIdAndUpdate is called with correct arguments
//       expect(findByIdAndUpdateStub.calledOnceWithExactly(id, updatedData, { new: true })).to.be.true;

//       // Assertion: Ensure the returned result is the updated admin
//       expect(result).to.deep.equal(updatedAdmin);  // Ensure the result matches the expected updated admin
//     });

//     it("should return null if the admin is not found to update", async () => {
//       const id = "nonexistentId";
//       const updatedData = { name: "Updated Admin" };

//       // Stub the findByIdAndUpdate method to return null when the admin is not found
//       const findByIdAndUpdateStub = sandbox.stub(Admin, "findByIdAndUpdate").resolves(null);

//       const result = await AdminRepository.updateById(id, updatedData);

//       // Assertion: Ensure findByIdAndUpdate is called with the correct parameters
//       expect(findByIdAndUpdateStub.calledOnceWithExactly(id, updatedData, { new: true })).to.be.true;

//       // Assertion: Ensure result is null if admin is not found
//       expect(result).to.be.null;  // Ensure null is returned when admin is not found
//     });
//   });

//   describe("deleteById", () => {
//     it("should delete an admin by ID", async () => {
//       const id = "60b8d295f4c5c0071c78ab34";
//       const deletedAdmin = { name: "Admin", email: "admin@example.com", password: "password123" };

//       const findByIdAndDeleteStub = sandbox.stub(Admin, "findByIdAndDelete").resolves(deletedAdmin);

//       const result = await AdminRepository.deleteById(id);

//       expect(findByIdAndDeleteStub.calledOnceWithExactly(id)).to.be.true;
//       expect(result).to.deep.equal(deletedAdmin);
//     });

//     it("should return null if admin is not found to delete", async () => {
//       const id = "nonexistentId";

//       const findByIdAndDeleteStub = sandbox.stub(Admin, "findByIdAndDelete").resolves(null);

//       const result = await AdminRepository.deleteById(id);

//       expect(findByIdAndDeleteStub.calledOnceWithExactly(id)).to.be.true;
//       expect(result).to.be.null;
//     });
//   });

//   describe("findAll", () => {
//     it("should return all admins", async () => {
//       const adminList = [
//         { name: "Admin1", email: "admin1@example.com", password: "password123" },
//         { name: "Admin2", email: "admin2@example.com", password: "password123" },
//       ];

//       const findStub = sandbox.stub(Admin, "find").resolves(adminList);

//       const result = await AdminRepository.findAll();

//       expect(findStub.calledOnce).to.be.true;
//       expect(result).to.deep.equal(adminList);
//     });
//   });
// });
