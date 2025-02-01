import { body } from "express-validator";

// Validate email, password, and name during admin creation
export const adminCreationRequestValidatorValidationRules = () => {
  return [
    body("otp1")
      .notEmpty()
      .withMessage("OTP1 is required")
      .isNumeric()
      .withMessage("OTP1 must be numeric")
      .isLength({ min: 3, max: 3 })
      .withMessage("OTP1 must be exactly 3 digits"),
    body("otp2")
      .notEmpty()
      .withMessage("OTP2 is required")
      .isNumeric()
      .withMessage("OTP2 must be numeric")
      .isLength({ min: 3, max: 3 })
      .withMessage("OTP2 must be exactly 3 digits"),
    body("newAdminsId")
      .notEmpty()
      .withMessage("New Admin's ID is required")
      .isMongoId()
      .withMessage("New Admin's ID must be a valid MongoDB ObjectId"),
  ];
};
