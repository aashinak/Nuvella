import { body } from "express-validator";

// Validator to check if adminId exists and is valid
export const addToCartValidationRules = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("Admin ID is required")
    .isMongoId()
    .withMessage("Invalid admin ID format"),
  body("productId")
    .trim()
    .notEmpty()
    .withMessage("Admin ID is required")
    .isMongoId()
    .withMessage("Invalid admin ID format"),
  body("size").trim().notEmpty().isAlpha().withMessage("Size is required"),
];
