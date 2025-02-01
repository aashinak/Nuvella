import { body, cookie } from "express-validator";

// Validate email, password, and name during admin creation
export const adminCreationRequestValidationRules = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long")
      .matches(/^[a-zA-Z_]+$/)
      .withMessage("Name must only contain alphabets and underscores"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>_\-]/)
      .withMessage("Password must contain at least one special character"),
    cookie("refreshToken").notEmpty().withMessage("Refresh token is required"),
  ];
};
