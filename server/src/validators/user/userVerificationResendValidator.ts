import { body } from "express-validator";

// Validator rules for OTP verification
export const userRegOtpResendValidationRules = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("Admin ID is required")
    .isMongoId()
    .withMessage("Invalid admin ID"),
];
