import { body } from "express-validator";

// Validator to check if adminId exists and is valid
export const adminIdValidationRules = () => {
  return [
    body("adminId")
      .trim()
      .notEmpty()
      .withMessage("Admin ID is required")
      .isMongoId()
      .withMessage("Invalid admin ID format"), // Validate MongoDB ObjectId
  ];
};
