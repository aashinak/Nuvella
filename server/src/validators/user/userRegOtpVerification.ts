import { body } from "express-validator";

// Validator rules for OTP verification
export const userRegOtpValidationRules = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("Admin ID is required")
    .isMongoId()
    .withMessage("Invalid admin ID"),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be a 6-digit number")
    .isNumeric()
    .withMessage("OTP must only contain numbers"),
];
